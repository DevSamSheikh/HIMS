/**
 * Module Types
 *
 * This file contains type definitions for modules and related data structures
 * used throughout the application.
 */

/**
 * Represents a module feature
 */
export interface ModuleFeature {
  name: string;
  included: boolean;
}

/**
 * Represents a module in the system
 */
export interface Module {
  id: string;
  title: string;
  description: string;
  price: number;
  category: string;
  features: ModuleFeature[];
}

/**
 * Represents a module that has been selected by the user
 */
export interface SelectedModule {
  id: string;
  name: string;
  price: number;
  billingCycle: "monthly" | "yearly";
  selected: boolean;
}

/**
 * Billing cycle options
 */
export type BillingCycle = "monthly" | "quarterly" | "yearly";

/**
 * Module category
 */
export type ModuleCategory =
  | "core"
  | "finance"
  | "operations"
  | "analytics"
  | "clinical";
