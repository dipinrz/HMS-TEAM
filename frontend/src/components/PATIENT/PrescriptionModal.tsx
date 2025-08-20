import React from 'react';
import {
    Typography,
    Box,
    Stack,
    Paper,
    Button,
} from '@mui/material';
import CustomModal from '../ui/CustomModal';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';



interface PrescriptionModalProps {
    open: boolean;
    onClose: () => void;
    title: string;
    prescriptions: any[];
}

const PrescriptionModal: React.FC<PrescriptionModalProps> = ({
    open,
    onClose,
    title,
    prescriptions
}) => {

    const handleDownload = () => {
        const doc = new jsPDF();
        let currentY = 20;

        // PDF styling constants
        const COLORS = {
            primary: [41, 128, 185] as [number, number, number],
            secondary: [52, 152, 219] as [number, number, number],
            text: [44, 62, 80] as [number, number, number],
            lightGray: [248, 249, 250] as [number, number, number],
            mediumGray: [236, 240, 241] as [number, number, number]
        };

        const FONTS = {
            title: { size: 18, style: 'bold' },
            sectionHeader: { size: 14, style: 'bold' },
            subHeader: { size: 12, style: 'bold' },
            body: { size: 11, style: 'normal' },
            small: { size: 9, style: 'normal' }
        };

        const SPACING = {
            sectionGap: 15,
            itemGap: 6,
            smallGap: 4
        };

        // Helper functions
        const setFont = (font: typeof FONTS.title) => {
            doc.setFontSize(font.size);
            doc.setFont('helvetica', font.style as any);
        };

        const addTitle = (title: string, y: number): number => {
            setFont(FONTS.title);
            doc.setTextColor(...COLORS.primary);
            doc.text(title, 20, y);
            const textWidth = doc.getTextWidth(title);
            doc.setDrawColor(...COLORS.primary);
            doc.setLineWidth(0.8);
            doc.line(20, y + 2, 20 + textWidth, y + 2);
            return y + 12;
        };

        const addSectionHeader = (header: string, y: number): number => {
            setFont(FONTS.sectionHeader);
            doc.setTextColor(...COLORS.secondary);
            doc.text(header, 20, y);
            return y + 10;
        };

        const VALUE_X = 90; // Fixed X position for all values

        const addInfoItem = (label: string, value: string, y: number): number => {
            setFont(FONTS.subHeader);
            doc.setTextColor(...COLORS.text);
            doc.text(`${label}:`, 25, y); // Label always starts at x=25

            setFont(FONTS.body);
            doc.text(value, VALUE_X, y); // Value always starts at fixed x

            return y + SPACING.itemGap;
        };

        const checkPageBreakForText = (requiredHeight: number, currentY: number) => {
            if (currentY + requiredHeight > 280) { // leave bottom margin
                doc.addPage();
                return 20; // reset Y
            }
            return currentY;
        };

        // Main PDF generation
        prescriptions.forEach((prescription: any, index: number) => {
            const appointment = prescription.appointment;
            const doctor = appointment.doctor;

            // Add title for first page
            if (index === 0) {
                currentY = addTitle('Medical Prescription Report', currentY);
                currentY += SPACING.sectionGap;
            } else {
                // Separator between prescriptions
                doc.setDrawColor(...COLORS.mediumGray);
                doc.setLineWidth(0.5);
                doc.line(20, currentY - 5, 190, currentY - 5);
                currentY += 10;
            }

            // ================= PRESCRIPTION DETAILS =================
            currentY = checkPageBreakForText(50, currentY);
            currentY = addSectionHeader('PRESCRIPTION INFORMATION', currentY);

            currentY = addInfoItem(
                'Prescribed Date',
                new Date(prescription.prescribed_date).toLocaleDateString('en-GB'),
                currentY
            );
            currentY = addInfoItem('Diagnosis', prescription.diagnosis || 'Not specified', currentY);

            currentY += SPACING.sectionGap;

            // ================= APPOINTMENT DETAILS =================
            currentY = checkPageBreakForText(70, currentY);
            currentY = addSectionHeader('APPOINTMENT DETAILS', currentY);

            currentY = addInfoItem(
                'Appointment Date',
                new Date(appointment.appointment_date).toLocaleDateString('en-GB'),
                currentY
            );
            currentY = addInfoItem('Status', appointment.status, currentY);
            currentY = addInfoItem('Reason for Visit', appointment.reason_for_visit, currentY);
            currentY = addInfoItem('Doctor Notes', appointment.notes || 'No additional notes', currentY);
            currentY = addInfoItem('Attending Physician', `Dr. ${doctor.first_name} ${doctor.last_name}`, currentY);

            currentY += SPACING.sectionGap;

            // ================= MEDICATION TABLE =================
            currentY = checkPageBreakForText(30, currentY);
            currentY = addSectionHeader('PRESCRIBED MEDICATIONS', currentY);
            currentY += 5;

            const medicineColumns = [
                { header: 'Medicine', dataKey: 'name' },
                { header: 'Dosage', dataKey: 'dosage' },
                { header: 'Freq./Day', dataKey: 'frequency' },
                { header: 'Duration', dataKey: 'duration' },
                { header: 'Instructions', dataKey: 'instructions' },
                { header: 'Cost', dataKey: 'cost' },
                { header: 'Expiry', dataKey: 'expiry' }
            ];

            const medicineRows = prescription.medicines.map((med: any) => ({
                name: med.medicine.medicine_name,
                dosage: med.dosage,
                frequency: `${med.frequency}x`,
                duration: `${med.duration} days`,
                instructions: med.instructions || 'N/A',
                cost: ` ${med.medicine.cost}`,
                expiry: new Date(med.medicine.expiry_date).toLocaleDateString('en-GB')
            }));

            autoTable(doc, {
                columns: medicineColumns,
                body: medicineRows,
                startY: currentY,
                theme: 'striped',
                headStyles: {
                    fillColor: COLORS.primary,
                    textColor: [255, 255, 255],
                    fontStyle: 'bold',
                    fontSize: 10,
                    halign: 'center'
                },
                bodyStyles: {
                    fontSize: 9,
                    cellPadding: { top: 4, right: 3, bottom: 4, left: 3 },
                    textColor: COLORS.text
                },
                alternateRowStyles: {
                    fillColor: COLORS.lightGray
                },
                styles: {
                    lineColor: COLORS.mediumGray,
                    lineWidth: 0.1,
                    cellPadding: { top: 4, right: 3, bottom: 4, left: 3 }
                },
                columnStyles: {
                    name: { cellWidth: 35 },
                    dosage: { cellWidth: 20, halign: 'center' },
                    frequency: { cellWidth: 18, halign: 'center' },
                    duration: { cellWidth: 20, halign: 'center' },
                    instructions: { cellWidth: 30 },
                    cost: { cellWidth: 18, halign: 'right' },
                    expiry: { cellWidth: 22, halign: 'center' }
                },
                margin: { left: 20, right: 20 },
                tableWidth: 'wrap'
            });

            currentY = (doc as any).lastAutoTable.finalY + SPACING.sectionGap;

            // ================= TOTAL COST =================
            if (prescription.medicines.length > 0) {
                const totalCost = prescription.medicines.reduce(
                    (sum: number, med: any) => sum + parseFloat(med.medicine.cost),
                    0
                );
                setFont(FONTS.subHeader);
                doc.setTextColor(...COLORS.primary);
                doc.text(`Total Medication Cost: ${totalCost.toFixed(2)}`, 20, currentY);
                currentY += 10;
            }
        });

        // ================= FOOTER =================
        // const pageCount = doc.getNumberOfPages();
        // for (let i = 1; i <= pageCount; i++) {
        //     doc.setPage(i);
        //     setFont(FONTS.small);
        //     doc.setTextColor(150, 150, 150);
        //     doc.text(
        //         `Generated on ${new Date().toLocaleDateString('en-GB')} at ${new Date().toLocaleTimeString('en-GB')}`,
        //         20,
        //         290
        //     );
        //     doc.text(`Page ${i} of ${pageCount}`, 180, 290);
        // }

        // Save PDF
        const fileName = `prescriptions_${new Date().toISOString().split('T')[0]}.pdf`;
        doc.save(fileName);
    };

    const renderPrescriptionContent = () => {
        if (!prescriptions.length) {
            return <Typography>No prescription found.</Typography>;
        }

        return (
            <Stack spacing={3}>
                {prescriptions.map((prescription: any, index: number) => (
                    <Paper
                        key={index}
                        elevation={3}
                        sx={{
                            p: 3,
                            borderRadius: 2,
                            bgcolor: 'background.paper',
                            border: '1px solid',
                            borderColor: 'divider',
                        }}
                    >
                        <Typography variant="h6" fontWeight={600} gutterBottom color="primary">
                            Diagnosis: {prescription.diagnosis}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" gutterBottom>
                            Prescribed on: {new Date(prescription.prescribed_date).toLocaleDateString()}
                        </Typography>

                        <Stack spacing={2} mt={2}>
                            {prescription.medicines.map((medicine: any, idx: number) => (
                                <Box
                                    key={idx}
                                    p={2}
                                    borderRadius={2}
                                    sx={{
                                        border: '1px dashed',
                                        borderColor: 'grey.400',
                                        bgcolor: 'grey.100',
                                    }}
                                >
                                    <Typography variant="subtitle1" textTransform={'capitalize'} fontWeight={500}>
                                        {medicine.medicine.medicine_name}
                                    </Typography>
                                    <Typography variant="body2">Dosage: {medicine.dosage}</Typography>
                                    <Typography variant="body2">Frequency: {medicine.frequency} times/day</Typography>
                                    <Typography variant="body2">Duration: {medicine.duration} days</Typography>
                                    {medicine.instructions && (
                                        <Typography variant="body2">Instructions: {medicine.instructions}</Typography>
                                    )}
                                </Box>
                            ))}
                        </Stack>
                    </Paper>
                ))}

                {/* Sticky Download Button */}
                <Box
                    position="sticky"
                    bottom={0}
                    zIndex={2}
                    bgcolor="background.paper"
                    py={2}
                // borderTop="1px solid"
                // borderColor="divider"
                >
                    {/* <Divider sx={{ mb: 2 }} /> */}
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={handleDownload}
                        fullWidth
                    >
                        Download as Pdf
                    </Button>
                </Box>
            </Stack>
        );
    };

    return (
        <CustomModal
            open={open}
            onClose={onClose}
            maxWidth="md"
            title={title}
            content={renderPrescriptionContent()}
        />
    );
};

export default PrescriptionModal;




