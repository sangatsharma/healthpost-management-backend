import { Patient, PrismaClient } from "@prisma/client";
import { NewPatientType } from "@app/src/validations/index.validation";
//
export class PatientRepository {
  constructor(private readonly prisma: PrismaClient["patient"]) { }

  async create(dto: NewPatientType & {
    healthPostId: string
  }): Promise<Patient> {
    const patient = await this.prisma.create({
      data: {
        ...dto,
        role: "PATIENT",
      }
    });

    return patient;
  };

  async addCode(id: string, code: string) {
    return await this.prisma.update({
      where: {
        id: id
      },
      data: {
        patientCode: code
      }
    });
  }

  async getAll(): Promise<Patient[]> {
    const patients = await this.prisma.findMany({});
    return patients;
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

  async getById(id: string): Promise<Patient | null> {
    const patient = await this.prisma.findUnique({
      where: {
        id
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

  async findByUserId(userId: string): Promise<Patient | null> {
    const patient = await this.prisma.findUnique({
      where: {
        id: userId
      }
    });

    return patient;
  }

  async findByEmail(email: string): Promise<Patient | null> {
    const patient = await this.prisma.findUnique({
      where: {
        email: email
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
}
