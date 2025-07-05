import { Patient, PrismaClient } from "@prisma/client";
import { NewPatientType } from "@app/src/validations/index.validation";
//
export class PatientRepository {
  constructor(private readonly prisma: PrismaClient["patient"]) { }

  async create(dto: NewPatientType & {
    healthPostId: string
  }): Promise<Patient> {
    const patient = await this.prisma.create({
      data: dto
    });

    return patient;
  };

  async getAll(): Promise<Patient[]> {
    const patients = await this.prisma.findMany({});
    return patients;
  }

  async getAllMin() {
    const patients = await this.prisma.findMany({
      select: {
        userId: true,
        user: {
          select: {
            firstName: true,
            middleName: true,
            lastName: true
          }
        }
      }
      // include: {
      //   user: {
      //     select: {
      //       id: true,
      //       firstName: true,
      //       middleName: true,
      //       lastName: true,
      //     },
      //   },
      // }
    });

    return patients;
  }

  async getById(userId: string, healthPostId: string): Promise<Patient | null> {
    const patient = await this.prisma.findUnique({
      where: {
        userId_healthPostId: {
          userId,
          healthPostId
        }
      }
    });
    return patient;
  }

  async findById(id: string): Promise<Patient | null> {
    const patient = await this.prisma.findUnique({
      where: {
        id: id
      }
    });

    return patient;
  }

  async findByUserId(userId: string, healthPostId: string): Promise<Patient | null> {
    const patient = await this.prisma.findUnique({
      where: {
        userId_healthPostId: {
          userId: userId,
          healthPostId: healthPostId
        }
      }
    });

    return patient;
  }

  async delete(id: string): Promise<Patient | null> {
    const deletedPatient = await this.prisma.delete({
      where: {
        id: id
      }
    });

    return deletedPatient;
  }

  // async update(id: string, dto: UpdatePatientType): Promise<Patient> {
  //   const updatedPatient = await this.prisma.update({
  //     where: {
  //       id: id
  //     },
  //     data: {
  //       ...dto,
  //     }
  //   });
  //
  //   return updatedPatient;
  // }
}
