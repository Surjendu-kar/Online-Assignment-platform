"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/animate-ui/components/radix/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { supabase } from "@/lib/supabase/client";
import { XIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import toast from 'react-hot-toast';

interface ProfileSetupDialogProps {
  isOpen: boolean;
  onSetupComplete: () => void;
  userId: string;
}

export const ProfileSetupDialog = ({
  isOpen,
  onSetupComplete,
  userId,
}: ProfileSetupDialogProps) => {
  const [institutionName, setInstitutionName] = React.useState("");
  const [departments, setDepartments] = React.useState<string[]>([]);
  const [departmentInput, setDepartmentInput] = React.useState("");
  const [errors, setErrors] = React.useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!institutionName.trim()) {
      newErrors.institutionName = "Institution name is required";
    }

    // Check if at least one department is provided
    if (departments.length === 0) {
      newErrors.departments = "At least one department is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (validateForm()) {
      try {
        // Show loading toast
        const loadingToast = toast.loading('Setting up your institution...');

        // Create institution
        const { data: newInst, error: instError } = await supabase
          .from('institutions')
          .insert({ 
            name: institutionName,
            description: institutionName, // Default description to name
            created_by: userId
          })
          .select()
          .single();

        if (instError) {
          toast.dismiss(loadingToast);
          toast.error('Failed to create institution');
          console.error("Error creating institution:", instError);
          return;
        }

        // Create departments with default codes and descriptions
        const departmentData = departments
          .map(name => ({
            name: name.trim(),
            code: name.trim().substring(0, 4).toUpperCase(), // Default code from first 4 chars
            description: `${name.trim()} Department`, // Default description
            institution_id: newInst.id,
            created_by: userId
          }));

        if (departmentData.length > 0) {
          const { error: deptError } = await supabase
            .from('departments')
            .insert(departmentData);

          if (deptError) {
            toast.dismiss(loadingToast);
            toast.error('Failed to create departments');
            console.error("Error creating departments:", deptError);
            return;
          }
        }

        // Update user profile with institution
        const { error } = await supabase
          .from('user_profiles')
          .update({ 
            institution_id: newInst.id,
            profile_completed: true 
          })
          .eq('id', userId);

        if (!error) {
          toast.dismiss(loadingToast);
          toast.success('Profile setup completed successfully!');
          onSetupComplete();
        } else {
          toast.dismiss(loadingToast);
          toast.error('Failed to update profile');
          console.error("Error updating profile:", error);
        }
      } catch (error) {
        toast.error('An unexpected error occurred');
        console.error("Error saving profile:", error);
      }
    }
  };

  const addDepartment = () => {
    if (departmentInput.trim() && !departments.includes(departmentInput.trim())) {
      setDepartments([...departments, departmentInput.trim()]);
      setDepartmentInput("");
    }
  };

  const removeDepartment = (index: number) => {
    const newDepartments = [...departments];
    newDepartments.splice(index, 1);
    setDepartments(newDepartments);
  };

  const handleDepartmentKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addDepartment();
    }
  };

  return (
    <Dialog open={isOpen} disableCloseOnClickOutside={true} closeOnEscape={false}>
      <DialogContent 
        className="sm:max-w-[500px]" 
        showCloseButton={false}
        disableCloseOnClickOutside={true}
      >
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Setup Your Institution</DialogTitle>
            <DialogDescription>
              Please provide your institution information to continue. You can add department codes and descriptions later.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            {/* Institution Name */}
            <div className="grid gap-2">
              <Label htmlFor="institutionName">Institution Name *</Label>
              <Input
                id="institutionName"
                value={institutionName}
                onChange={(e) => setInstitutionName(e.target.value)}
                placeholder="e.g. University of Technology"
                className={errors.institutionName ? "border-red-500" : ""}
              />
              {errors.institutionName && (
                <span className="text-sm text-red-500">{errors.institutionName}</span>
              )}
            </div>

            {/* Departments */}
            <div className="grid gap-2">
              <div className="flex justify-between items-center">
                <Label htmlFor="departmentInput">Departments *</Label>
                <p className="text-sm text-muted-foreground">
                  Add at least one department. Codes and descriptions can be added later.
                </p>
              </div>
              
              {/* Department Tags with Animation */}
              {departments.length > 0 && (
                <div className="flex flex-wrap gap-2 p-2 border rounded-md min-h-[40px]">
                  <AnimatePresence>
                    {departments.map((dept, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        transition={{ duration: 0.2 }}
                        className="flex items-center gap-1 bg-blue-100 text-blue-800 px-2 py-1 rounded-md text-sm"
                      >
                        <span className="uppercase font-medium">{dept}</span>
                        <button
                          type="button"
                          onClick={() => removeDepartment(index)}
                          className="text-blue-800 hover:text-blue-900 focus:outline-none"
                        >
                          <XIcon className="w-4 h-4" />
                        </button>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              )}
              
              {/* Department Input - Full Width */}
              <Input
                id="departmentInput"
                value={departmentInput}
                onChange={(e) => setDepartmentInput(e.target.value)}
                onKeyPress={handleDepartmentKeyPress}
                placeholder="Type department name and press Enter"
                className={errors.departments ? "border-red-500" : ""}
              />
              
              {errors.departments && (
                <span className="text-sm text-red-500">{errors.departments}</span>
              )}
              
              <p className="text-xs text-muted-foreground mt-1">
                Default codes will be created from the first 4 letters of each department name. 
                You can edit these codes and add detailed descriptions later through the department management interface.
              </p>
            </div>
          </div>

          <DialogFooter>
            <Button type="submit">Save and Continue</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};