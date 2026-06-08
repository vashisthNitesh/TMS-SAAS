import {
  PackageIcon,
  TruckIcon,
  BillingIcon,
  CoinsIcon,
  DocListIcon,
  BarChartIcon,
  UsersIcon,
  SettingsIcon,
  StoreIcon
} from "./icons";

export interface ModuleConfig {
  key: string;
  name: string;
  description: string;
  icon: any;
  category: "core" | "operations" | "distribution" | "finance" | "support";
}

export const PLATFORM_MODULES: ModuleConfig[] = [
  {
    key: "CRM",
    name: "CRM & Sales",
    description: "Manage customer profiles, contracts, sales pipeline, and order intakes.",
    icon: UsersIcon,
    category: "operations"
  },
  {
    key: "INVENTORY",
    name: "Inventory & Warehouse",
    description: "Control warehouses, rack storage profiles, SKU logs, and stock levels.",
    icon: PackageIcon,
    category: "distribution"
  },
  {
    key: "TRANSPORTATION",
    name: "Transportation execution",
    description: "Allocate shipments, dispatch trips, track routes, and manage driver tasks.",
    icon: TruckIcon,
    category: "operations"
  },
  {
    key: "BILLING",
    name: "Billing & Invoices",
    description: "Generate customer invoices, settle carrier payments, and audit detention charges.",
    icon: CoinsIcon,
    category: "finance"
  },
  {
    key: "DMS",
    name: "DMS & Compliance",
    description: "Upload PODs, verify safety permits, and trigger automated OCR checks.",
    icon: DocListIcon,
    category: "support"
  },
  {
    key: "REPORTING",
    name: "Reporting Engine",
    description: "Export custom excel reports, load KPI dashboard widgets, and track SLA metrics.",
    icon: BarChartIcon,
    category: "support"
  }
];
