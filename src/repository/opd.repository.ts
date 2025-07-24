import { PrismaClient, OpdVisit } from "@prisma/client";
import { OpdVisitType } from "../validations/opd.validation";

export class OpdVisitRepository {
  constructor(
    private readonly prisma: PrismaClient["opdVisit"]
  ) { }

  async create(dto: OpdVisitType): Promise<OpdVisit> {
    const {
      visitedDate,
      patientId,
      examinerId,
      healthPostId,
      complaints,
      diagnosis,
      observedExamination,
      treatment,
      followUpRequired,
      followUpDate,
      isGenderViolence,
      isPregenant,
      treatementType,
      visitType,
      prescriptions,
      medicines,
      Vitals,
    } = dto;

    return this.prisma.create({
      data: {
        visitedDate,
        patient: { connect: { id: patientId } },
        examiner: { connect: { id: examinerId } },
        healthPost: { connect: { id: healthPostId } },
        complaints,
        diagnosis,
        observedExamination,
        treatment,
        followUpRequired,
        followUpDate,
        isGenderViolence,
        isPregenant,
        treatementType,
        visitType,
        prescriptions: {
          create: prescriptions.map((prescription) => ({
            name: prescription.name,
            duration: prescription.duration,
            frequency: prescription.frequency,
            intakeTime: prescription.intakeTime,
            quantity: prescription.quantity,
            intakeRoute: prescription.intakeRoute,
            timing: prescription.timing,
            dosage: prescription.dosage,
          })),
        },
        medicines,
        vitals: {
          create: Vitals
        },
      },
      include: {
        vitals: true,
        prescriptions: true
      }
    });
  }

  async getByPatientId(
    patientId: string,
  ) {
    const allDatas = await this.prisma.findMany({
      where: {
        patientId,
      }
    });

    return allDatas;
  }

  async getById(
    id: string
  ) {
    const oneOpd = await this.prisma.findUnique({
      where: {
        id: id
      }
    });

    return oneOpd;
  }
}
