import { Patient, PrismaClient } from "@prisma/client";
import { NewPatientType, UpdatePatientType } from "@app/src/validations/index.validation";
import { profile } from "console";

function modifyImage(data: Patient) {
  const { profileImage, ...rest } = data;
  return {
    ...rest,
    profileImage: profileImage ? [profileImage] : []
  };
}
export class PatientRepository {
  constructor(private readonly prisma: PrismaClient["patient"]) { }

  async create(dto: NewPatientType & {
    healthPostId: string,
    profileImage: string | null
  }) {
    const patient = await this.prisma.create({
      data: {
        ...dto,
        profileImage: dto.profileImage,
        role: "PATIENT",
      }
    });

    return modifyImage(patient);
  };

  async update(dto: UpdatePatientType) {
    const { patientId, ...rest } = dto;
    const updatedPatient = await this.prisma.update({
      data: rest
      ,
      where: {
        id: patientId
      }
    });

    return modifyImage(updatedPatient);
  }

  async addCode(id: string, code: string) {
    return modifyImage(await this.prisma.update({
      where: {
        id: id
      },
      data: {
        patientCode: code
      }
    }));
  }

  async getAll() {
    const patients = await this.prisma.findMany({});
    return patients.map(({ profileImage, ...rest }) => (
      {
        profileImage: profileImage ? [profileImage] : [],
        ...rest
      }
    ));
  }

  async getAllMin() {
    const patients = await this.prisma.findMany({
      select: {
        id: true,
        firstName: true,
        middleName: true,
        lastName: true
      }
    });

    return patients;
  }

  async getPatientByHp(hpId: string) {
    const patients = await this.prisma.findMany({
      where: {
        role: "PATIENT",
        healthPostId: hpId
      }
    });

    return patients.map(({ profileImage, ...rest }) => (
      {
        profileImage: profileImage ? [profileImage] : [],
        ...rest
      }
    ));
  }

  async getById(id: string) {
    const patient = await this.prisma.findUnique({
      where: {
        id
      }
    });
    return patient;
  }

  async findById(id: string) {
    const patient = await this.prisma.findUnique({
      where: {
        id: id
      },
      include: {
        healthPost: {
          select: {
            name: true
          }
        }
      }
    });

    return patient;
  }

  async findByUserId(userId: string): Promise<Patient | null> {
    const patient = await this.prisma.findUnique({
      where: {
        id: userId
      }
    });

    return patient;
  }

  async findByEmail(email: string) {
    const patient = await this.prisma.findUnique({
      where: {
        email: email
      },
      include: {
        healthPost: {
          select: {
            name: true
          }
        }
      }
    });

    if (!patient)
      return null;
    return {
      id: patient.id,
      accountType: patient.accountType,
      fullName: {
        firstName: patient.firstName,
        middleName: patient.middleName,
        lastName: patient.lastName
      },
      email: patient.email,
      role: patient.role,
      phoneNumber: patient.phoneNumber,
      status: patient.status,
      permissions: [],
      healthPostId: patient.healthPostId,
      gender: patient.gender,
      profileImage: patient.profileImage,
      signature: [],
      healthPost: {
        name: patient.healthPost.name,
      },
      createdAt: patient.createdAt,
      refreshToken: patient.updatedAt,
    };
  };

  async delete(id: string): Promise<Patient | null> {
    const deletedPatient = await this.prisma.delete({
      where: {
        id: id
      }
    });

    return deletedPatient;
  }

  async countPatientPerHealthpost(healthPostId: string) {
    const patientCount = await this.prisma.count({
      where: {
        healthPostId: healthPostId
      }
    });

    return patientCount;
  }

  async updateVisitCount(patientId: string) {
    await this.prisma.update({
      where: {
        id: patientId
      },
      data: {
        hpVisitCount: {
          increment: 1
        }
      }
    });
  }
}
