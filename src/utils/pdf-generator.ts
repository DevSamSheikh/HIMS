/**
 * PDF Generator Utility
 *
 * This file contains utility functions for generating PDF documents,
 * particularly for module quotes and other downloadable documents.
 */

import { jsPDF } from "jspdf";
import "jspdf-autotable";
import { SelectedModule } from "../types/modules";

interface QuoteDetails {
  selectedModules?: {
    id: string;
    name: string;
    price: number;
    billingCycle?: "monthly" | "yearly" | "biennial";
  }[];
  pricing: {
    subtotal: number;
    bundleDiscount?: number;
    couponDiscount?: number;
    total: number;
  };
  customer: {
    facilityName?: string;
    date: string;
    quoteNumber: string;
  };
  billingCycle: "monthly" | "yearly" | "biennial";
  isDistributor?: boolean;
  distributorPlan?: {
    name: string;
    price: number;
    downPayment?: number | null;
  } | null;
  appliedCoupon?: string | null;
}

/**
 * Generates a PDF quote for the selected modules
 *
 * @param quoteDetails Details needed to generate the quote
 * @returns Promise that resolves when the PDF is generated and downloaded
 */
export const generateQuotePDF = async (
  quoteDetails: QuoteDetails,
): Promise<boolean> => {
  try {
    console.log("Generating PDF with details:", quoteDetails);

    // Create a new PDF document
    const doc = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4",
    });

    // Add letterhead
    addLetterhead(doc);

    // Add quote title and information
    doc.setFontSize(18);
    doc.setFont("helvetica", "bold");
    doc.text(
      quoteDetails.isDistributor
        ? "Distributor Plan Quote"
        : "Module Subscription Quote",
      20,
      50,
    );

    // Add quote details
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text(`Quote #: ${quoteDetails.customer.quoteNumber}`, 20, 60);
    doc.text(`Date: ${quoteDetails.customer.date}`, 20, 65);
    if (quoteDetails.customer.facilityName) {
      doc.text(`Facility: ${quoteDetails.customer.facilityName}`, 20, 70);
    }

    // Add billing cycle information
    const billingText = getBillingText(quoteDetails.billingCycle);
    doc.text(
      `Billing Cycle: ${quoteDetails.billingCycle} (${billingText})`,
      20,
      75,
    );

    // Add items table
    const startY = 85;
    let tableRendered = false;

    if (quoteDetails.isDistributor && quoteDetails.distributorPlan) {
      console.log("Rendering distributor plan table");
      // Distributor plan table
      const distributorData = [
        [
          quoteDetails.distributorPlan.name,
          formatCurrency(quoteDetails.distributorPlan.price),
          "1",
          formatCurrency(quoteDetails.distributorPlan.price),
        ],
      ];

      try {
        doc.autoTable({
          startY,
          head: [["Plan", "Price", "Quantity", "Total"]],
          body: distributorData,
          theme: "grid",
          headStyles: {
            fillColor: [41, 128, 185],
            textColor: 255,
            fontStyle: "bold",
          },
          styles: {
            halign: "center",
            overflow: "linebreak",
            cellPadding: 7,
            fontSize: 9,
          },
          columnStyles: {
            0: { halign: "left", cellWidth: 80 },
            1: { halign: "right", cellWidth: 35 },
            2: { halign: "center", cellWidth: 25 },
            3: { halign: "right", cellWidth: 35 },
          },
          margin: { left: 20, right: 20 },
        });
        console.log(
          "Distributor table rendered, lastAutoTable:",
          (doc as any).lastAutoTable,
        );
        tableRendered = true;
      } catch (error) {
        console.error("Error rendering distributor table:", error);
      }

      // Add down payment if applicable
      if (quoteDetails.distributorPlan.downPayment) {
        let currentY = 120; // Default value if no table was rendered
        if ((doc as any).lastAutoTable && (doc as any).lastAutoTable.finalY) {
          // Add extra spacing to prevent overlap
          currentY = (doc as any).lastAutoTable.finalY + 35;
        } else {
          console.log(
            "Warning: lastAutoTable or finalY is undefined for down payment, using default currentY value",
          );
        }
        doc.text("Down Payment:", 20, currentY);
        doc.text(
          formatCurrency(quoteDetails.distributorPlan.downPayment),
          190,
          currentY,
          { align: "right" },
        );
        doc.text(
          "(One-time payment required to start as a distributor)",
          20,
          currentY + 7,
        );
      }
    } else if (
      quoteDetails.selectedModules &&
      quoteDetails.selectedModules.length > 0
    ) {
      console.log("Rendering modules table");
      // Modules table
      const modulesData = quoteDetails.selectedModules.map((module) => [
        module.name,
        formatCurrency(module.price),
        "1",
        formatCurrency(module.price),
      ]);

      try {
        doc.autoTable({
          startY,
          head: [["Module", "Price", "Quantity", "Total"]],
          body: modulesData,
          theme: "grid",
          headStyles: {
            fillColor: [41, 128, 185],
            textColor: 255,
            fontStyle: "bold",
          },
          styles: {
            halign: "center",
            overflow: "linebreak",
            cellPadding: 7,
            fontSize: 9,
          },
          columnStyles: {
            0: { halign: "left", cellWidth: 80 },
            1: { halign: "right", cellWidth: 35 },
            2: { halign: "center", cellWidth: 25 },
            3: { halign: "right", cellWidth: 35 },
          },
          margin: { left: 20, right: 20 },
        });
        console.log(
          "Modules table rendered, lastAutoTable:",
          (doc as any).lastAutoTable,
        );
        tableRendered = true;
      } catch (error) {
        console.error("Error rendering modules table:", error);
      }
    }

    // Add pricing summary
    // Check if lastAutoTable exists and has finalY property
    let summaryY = 150; // Default value if no table was rendered
    if (
      tableRendered &&
      (doc as any).lastAutoTable &&
      (doc as any).lastAutoTable.finalY
    ) {
      summaryY = (doc as any).lastAutoTable.finalY + 40; // Increased spacing
    } else {
      console.log(
        "Warning: No table rendered or lastAutoTable/finalY is undefined, using default summaryY value",
      );
    }

    // Create a pricing summary section with proper spacing
    const pricingSummaryX = 130; // X position for labels
    const pricingSummaryValueX = 190; // X position for values
    const lineSpacing = 12; // Increased spacing between lines

    // Subtotal
    doc.text("Subtotal:", pricingSummaryX, summaryY);
    doc.text(
      formatCurrency(quoteDetails.pricing.subtotal),
      pricingSummaryValueX,
      summaryY,
      {
        align: "right",
      },
    );

    let currentY = summaryY + lineSpacing;

    // Bundle discount if applicable
    if (
      quoteDetails.pricing.bundleDiscount &&
      quoteDetails.pricing.bundleDiscount > 0
    ) {
      doc.text("Bundle Discount (10%):", pricingSummaryX, currentY);
      doc.text(
        `-${formatCurrency(quoteDetails.pricing.bundleDiscount)}`,
        pricingSummaryValueX,
        currentY,
        { align: "right" },
      );
      currentY += lineSpacing;
    }

    // Coupon discount if applicable
    if (
      quoteDetails.pricing.couponDiscount &&
      quoteDetails.pricing.couponDiscount > 0
    ) {
      doc.text(
        `Coupon Discount ${quoteDetails.appliedCoupon ? `(${quoteDetails.appliedCoupon})` : ""}:`,
        pricingSummaryX,
        currentY,
      );
      doc.text(
        `-${formatCurrency(quoteDetails.pricing.couponDiscount)}`,
        pricingSummaryValueX,
        currentY,
        { align: "right" },
      );
      currentY += lineSpacing;
    }

    // Add separator line
    doc.setDrawColor(200, 200, 200);
    doc.line(pricingSummaryX, currentY, pricingSummaryValueX, currentY);
    currentY += lineSpacing;

    // Total
    doc.setFont("helvetica", "bold");
    doc.text("Total:", pricingSummaryX, currentY);
    doc.text(
      formatCurrency(quoteDetails.pricing.total),
      pricingSummaryValueX,
      currentY,
      {
        align: "right",
      },
    );
    doc.text(
      quoteDetails.billingCycle === "monthly"
        ? "per month"
        : quoteDetails.billingCycle === "yearly"
          ? "per year"
          : "per 2 years",
      pricingSummaryValueX,
      currentY + 7,
      { align: "right" },
    );

    // Add terms and conditions
    currentY += 35; // Increased spacing before terms
    doc.setFontSize(11);
    doc.setFont("helvetica", "bold");
    doc.text("Terms and Conditions", 20, currentY);
    currentY += 8;

    doc.setFontSize(9);
    doc.setFont("helvetica", "normal");
    const terms = [
      "1. This quote is valid for 30 days from the date of issue.",
      "2. Prices are subject to change without notice after the validity period.",
      "3. Payment terms: Net 30 days from invoice date.",
      "4. Subscription begins upon activation of services.",
      "5. Cancellation requires 30 days written notice before the next billing cycle.",
    ];

    terms.forEach((term) => {
      doc.text(term, 20, currentY);
      currentY += 7; // Increased spacing between terms
    });

    // Add footer
    addFooter(doc);

    // Save the PDF with a unique name based on timestamp
    const timestamp = new Date().getTime();
    const filename = `HIMS_Quote_${timestamp}.pdf`;
    console.log("Saving PDF as:", filename);
    doc.save(filename);

    return true;
  } catch (error) {
    console.error("Error generating PDF:", error);
    return false;
  }
};

/**
 * Adds a professional letterhead to the PDF
 */
const addLetterhead = (doc: jsPDF) => {
  // Add logo (using a placeholder rectangle for now)
  doc.setFillColor(41, 128, 185); // Blue color
  doc.rect(20, 15, 40, 15, "F");

  // Add company name
  doc.setFontSize(22);
  doc.setTextColor(41, 128, 185);
  doc.setFont("helvetica", "bold");
  doc.text("HIMS Healthcare", 70, 25);

  // Add tagline
  doc.setFontSize(10);
  doc.setTextColor(100, 100, 100);
  doc.setFont("helvetica", "italic");
  doc.text("Advanced Healthcare Information Management System", 70, 32);

  // Add contact information
  doc.setFontSize(8);
  doc.setTextColor(80, 80, 80);
  doc.setFont("helvetica", "normal");
  doc.text(
    "123 Medical Plaza, Suite 456 | Healthcare City, HC 12345",
    130,
    20,
    { align: "right" },
  );
  doc.text("Phone: (555) 123-4567 | Email: info@himshealthcare.com", 130, 25, {
    align: "right",
  });
  doc.text("www.himshealthcare.com", 130, 30, { align: "right" });

  // Add horizontal line
  doc.setDrawColor(200, 200, 200);
  doc.setLineWidth(0.5);
  doc.line(20, 40, 190, 40);
};

/**
 * Adds a footer to the PDF
 */
const addFooter = (doc: jsPDF) => {
  const pageCount = doc.getNumberOfPages();

  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);

    // Add horizontal line
    doc.setDrawColor(200, 200, 200);
    doc.setLineWidth(0.5);
    doc.line(20, 280, 190, 280);

    // Add footer text
    doc.setFontSize(8);
    doc.setTextColor(100, 100, 100);
    doc.text(
      "Thank you for choosing HIMS Healthcare for your medical information management needs.",
      105,
      287,
      { align: "center" },
    );
    doc.text(`Page ${i} of ${pageCount}`, 190, 287, { align: "right" });
  }
};

/**
 * Gets the billing text based on the billing cycle
 */
const getBillingText = (billingCycle: string): string => {
  switch (billingCycle) {
    case "yearly":
      return "billed annually";
    case "biennial":
      return "billed every 2 years";
    default:
      return "billed monthly";
  }
};

/**
 * Formats currency values for display in PDFs
 *
 * @param value The numeric value to format
 * @returns Formatted currency string
 */
export const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
  }).format(value);
};
