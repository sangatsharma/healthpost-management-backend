import { PrismaClient, OpdVisit } from "@prisma/client";
import { OpdVisitType } from "../validations/opd.validation";
import { CreateOpdReferralInput } from "../validations/opdReferral.validation";

export class OpdVisitRepository {
  constructor(
    private readonly prisma: PrismaClient["opdVisit"],
    private readonly opdReferral: PrismaClient["opdReferral"]
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
      vitals,
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
          create: vitals
        },
      },
      include: {
        patient: {
          select: {
            palityId: true
          }
        },
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
      },
      include: {
        vitals: true,
        patient: {
          select: {
            firstName: true,
            middleName: true,
            lastName: true,
            dobBs: true,
            patientCode: true,
            districtId: true,
            palityId: true,
            tole: true,
            wardNo: true,
            gender: true,
            nationality: true,
            phoneNumber: true,
            emergencyContact: true,
          },
        },
        healthPost: {
          select: {
            name: true
          }
        },
        prescriptions: true,
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
      },
      include: {
        vitals: true,
        patient: {
          select: {
            firstName: true,
            middleName: true,
            lastName: true,
            dobBs: true,
            patientCode: true,
            districtId: true,
            palityId: true,
            tole: true,
            wardNo: true,
            gender: true,
            nationality: true,
            phoneNumber: true,
            emergencyContact: true,
          },
        },
        healthPost: {
          select: {
            name: true
          }
        },
        prescriptions: true
      }
    });

    return oneOpd;
  }

  async getByHpId(
    id: string
  ) {
    const opds = await this.prisma.findMany({
      where: {
        healthPostId: id
      },
      include: {
        vitals: true,
        patient: {
          select: {
            firstName: true,
            middleName: true,
            lastName: true,
            dobBs: true,
            patientCode: true,
            palityId: true,
            districtId: true,
            tole: true,
            wardNo: true,
            gender: true,
            nationality: true,
            phoneNumber: true,
            emergencyContact: true,
          },
        },
        healthPost: {
          select: {
            name: true
          }
        },
        prescriptions: true
      }
    });

    return opds;
  }

  async getAll() {
    const opds = await this.prisma.findMany({
      include: {
        vitals: true,
        patient: {
          select: {
            firstName: true,
            middleName: true,
            lastName: true,
            dobBs: true,
            patientCode: true,
            palityId: true,
            districtId: true,
            tole: true,
            wardNo: true,
            gender: true,
            nationality: true,
            phoneNumber: true,
            emergencyContact: true,
          },
        },
        healthPost: {
          select: {
            name: true
          }
        },
        prescriptions: true
      }
    });

    return opds;
  }

  async createReferral(data: CreateOpdReferralInput) {
    return await this.opdReferral.create({
      data,
      include: {
        staff: {
          select: {
            id: true,
            firstName: true,
            middleName: true,
            lastName: true
          }
        },
        healthPost: {
          select: {
            id: true,
            name: true
          }
        },
        referredHealthPost: {
          select: {
            id: true,
            name: true
          }
        },
        patient: {
          select: {
            id: true,
            firstName: true,
            middleName: true,
            lastName: true
          }
        },
        opdVisit: true
      }
    });
  }

  async getReferralByOpdId(opdId: string) {
    return await this.opdReferral.findUnique({
      where: { opdId },
      include: {
        staff: {
          select: {
            id: true,
            firstName: true,
            middleName: true,
            lastName: true
          }
        },
        healthPost: {
          select: {
            id: true,
            name: true
          }
        },
        referredHealthPost: {
          select: {
            id: true,
            name: true
          }
        },
        patient: {
          select: {
            id: true,
            firstName: true,
            middleName: true,
            lastName: true
          }
        },
        opdVisit: true
      }
    });
  }

  async getReferralsForHealthPost(healthPostId: string, type: "SENT" | "RECEIVED") {
    const whereClause = type === "SENT"
      ? { healthPostId }
      : { referredHealthPostId: healthPostId };

    return await this.opdReferral.findMany({
      where: whereClause,
      include: {
        staff: {
          select: {
            id: true,
            firstName: true,
            middleName: true,
            lastName: true
          }
        },
        patient: {
          select: {
            id: true,
            firstName: true,
            middleName: true,
            lastName: true
          }
        },
        opdVisit: true,
        healthPost: {
          select: {
            id: true,
            name: true
          }
        },
        referredHealthPost: {
          select: {
            id: true,
            name: true
          }
        },
      },
      orderBy: {
        createdAt: "desc"
      }
    });
  }

  async updateReferralStatus(
    referralId: string,
    referralStatus: "APPROVED" | "REJECTED" | "COMPLETED"
  ) {
    const existingReferral = await this.opdReferral.findUnique({
      where: { id: referralId }
    });

    if (!existingReferral) {
      throw new Error("Referral not found");
    }

    if (existingReferral.referralStatus !== "PENDING") {
      throw new Error("Referral already acted upon");
    }

    return await this.opdReferral.update({
      where: { id: referralId },
      data: { referralStatus }
    });
  }
}
