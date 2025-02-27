import { calculateBookingEarnings, getBooking } from "@/app/actions/bookingActions";
import { NextRequest, NextResponse } from "next/server";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const TAX_RATE = 0.15;
const PRIMARY_COLOR = "#0038A8";
const SECONDARY_COLOR = "#000";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ booking_id: string }> }
) {
  const { booking_id } = await params;
  const booking = await getBooking(booking_id);

  if (!booking) {
    return NextResponse.json({ error: "No booking found" }, { status: 404 });
  }

  const subtotal = await calculateBookingEarnings(booking_id);
  const taxAmount = subtotal * TAX_RATE;
  const total = subtotal + taxAmount;

  const pdf = new jsPDF({ orientation: "p", unit: "mm", format: "a4" });
  
  pdf.setFont("helvetica");

  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();
  // Header
  pdf.setFillColor(PRIMARY_COLOR);
  pdf.rect(0, 0, pageWidth, 35, "F");
  pdf.setTextColor("#fff");
  pdf.setFontSize(20);
  pdf.text("INVOICE", pageWidth / 2 - 15, 10);

  pdf.setFontSize(12);
  pdf.text("AUTOMEDIC AUTO REPAIR SHOP", 20, 20);
  pdf.setFontSize(10);
  pdf.text("Thorban Road, St. John's, NL", 20, 25);
  pdf.text("Phone: +1 709 777 8888 | Email: automedic@gmail.com", 20, 30);

  // Invoice Details
  pdf.setTextColor(SECONDARY_COLOR);
  pdf.setFontSize(10);
  pdf.text(`Invoice #: INV-${booking.id}`, pageWidth - 60, 40);
  pdf.text(`Date: ${new Date().toLocaleDateString()}`, pageWidth - 60, 45);

  // Customer & Vehicle Info
  autoTable(pdf, {
    startY: 50,
    head: [["Customer Information", "Vehicle Information"]],
    body: [
      [
        `Name: ${booking.customer.name}\nPhone: ${booking.customer.phone}\nEmail: ${booking.customer.email}`,
        `Make: ${booking.vehicle?.make}\nModel: ${booking.vehicle?.model}\nYear: ${booking.vehicle?.year}`,
      ],
    ],
    theme: "grid",
    headStyles: { fillColor: PRIMARY_COLOR, textColor: "#fff" },
    styles: { fontSize: 10 },
  });

  // Services Table
  autoTable(pdf, {
    startY: (pdf as any).lastAutoTable.finalY + 10,
    head: [["Service Name", "Qty", "Unit Price", "Total"]],
    body: booking.services.map((service) => [
      service.service.name,
      service.qty,
      `$${service.service.price.toFixed(2)}`,
      `$${(service.service.price * parseInt(service.qty)).toFixed(2)}`,
    ]),
    theme: "striped",
    headStyles: { fillColor: PRIMARY_COLOR, textColor: "#fff" },
    styles: { fontSize: 10 },
  });

  // Used Inventory Table
  if(booking.UsedInventory.length>0){
    autoTable(pdf, {
      startY: (pdf as any).lastAutoTable.finalY + 10,
      head: [["Part Name", "Qty", "Unit Price", "Total"]],
      body:  booking.UsedInventory.map((inventory) => [
        `${inventory.inventory.brand} ${
          inventory.inventory.name
        } ${inventory.inventory.InventoryFields?.map(
          (field) => field.value
        ).join(" ")}`,
        `${inventory.quantity} ${inventory.inventory.measure_of_unit}`,
        `$${inventory.inventory.retailPrice.toFixed(2)}`,
        `$${(inventory.inventory.retailPrice * inventory.quantity).toFixed(2)}`,
      ]),
      theme: "striped",
      headStyles: { fillColor: PRIMARY_COLOR, textColor: "#fff" },
      styles: { fontSize: 10 },
    });
  }
  

  // Summary Section
  const summaryY = (pdf as any).lastAutoTable.finalY + 10;
  pdf.setFontSize(10);
  pdf.text("Subtotal:", 120, summaryY);
  pdf.text(`$${subtotal.toFixed(2)}`, 170, summaryY, { align: "right" });

  pdf.text("Sales Tax (15%):", 120, summaryY + 5);
  pdf.text(`$${taxAmount.toFixed(2)}`, 170, summaryY + 5, { align: "right" });

  pdf.setFontSize(12);
  pdf.setFont("helvetica", "bold");
  pdf.text("TOTAL:", 120, summaryY + 15);
  pdf.text(`$${total.toFixed(2)}`, 170, summaryY + 15, { align: "right" });

  // Footer
  const footerY = summaryY + 30;
  pdf.setFontSize(8);
  pdf.text(
    "Thank you for choosing Automedic Auto Repair Shop. Please contact us for any inquiries.",
    20,
    pageHeight - 20
  );
  pdf.text(
    "Address: Thorban RD, St. John's, NL | Phone: 709-000-0000 | Email: automedic@gmail.com | Web: www.automedic.com",
    20,
    pageHeight - 15
  );

  // Generate PDF buffer
  const pdfBuffer = Buffer.from(pdf.output("arraybuffer"));

  return new NextResponse(pdfBuffer, {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `inline; filename="invoice_${booking?.id}.pdf"`,
    },
  });
}
