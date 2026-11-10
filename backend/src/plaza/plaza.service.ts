import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Urbanizacion } from "../urbanizacion/entities/urbanizacion.entity";
import { Plaza } from "./entities/plaza.entity";

@Injectable()
export class PlazaService {
  constructor(
    @InjectRepository(Plaza)
    private readonly plazaRepository: Repository<Plaza>,
    @InjectRepository(Urbanizacion)
    private readonly urbanizacionRepository: Repository<Urbanizacion>,
  ) {}

  findAllUrbanizaciones() {
    return this.urbanizacionRepository.find({
      relations: { plazas: true },
      order: { id: "ASC" },
    });
  }

  async findOneUrbanizacion(id: number) {
    const item = await this.urbanizacionRepository.findOne({
      where: { id },
      relations: { plazas: true },
    });
    if (!item) {
      throw new NotFoundException(`No existe la urbanización con id ${id}`);
    }
    return item;
  }

  createUrbanizacion(nombre: string) {
    const item = this.urbanizacionRepository.create({ nombre });
    return this.urbanizacionRepository.save(item);
  }

  async eliminarUrbanizacion(id: number) {
    const res = await this.urbanizacionRepository.delete(id);
    if (res.affected === 0) {
      throw new NotFoundException(`No existe la urbanización con id ${id}`);
    }
    return { ok: true, id };
  }

  modificarUrbanizacion(id: number, nombre: string) {
    return this.urbanizacionRepository
      .createQueryBuilder()
      .update(Urbanizacion)
      .set({ nombre })
      .where("id = :id", { id })
      .execute();
  }

  async eliminarPlaza(id: number) {
    const res = await this.plazaRepository.delete(id);
    if (res.affected === 0) {
      throw new NotFoundException(`No existe la plaza con id ${id}`);
    }
    return { ok: true, id };
  }

  cambiarPrincipal(id: number, principalId: number) {
    return this.plazaRepository
      .createQueryBuilder()
      .update(Plaza)
      .set({ urbanizacion: { id: principalId } as any })
      .where("id = :id", { id })
      .execute();
  }

  modificarPlaza(id: number, data: { nombre?: string; superficieM2?: number }) {
    const updateData: any = {};
    if (data.nombre !== undefined) updateData.nombre = data.nombre;
    if (data.superficieM2 !== undefined) updateData.superficieM2 = data.superficieM2;
    return this.plazaRepository
      .createQueryBuilder()
      .update(Plaza)
      .set(updateData)
      .where("id = :id", { id })
      .execute();
  }

  eliminarPorUrbanizacion(principalId: number) {
    return this.plazaRepository
      .createQueryBuilder()
      .delete()
      .from(Plaza)
      .where("urbanizacion_id = :principalId", { principalId })
      .execute();
  }

  async createPlaza(nombre: string, superficieM2: number, urbanizacionId: number) {
    const urbanizacion = await this.findOneUrbanizacion(urbanizacionId);
    const plaza = this.plazaRepository.create({
      nombre,
      superficieM2,
      urbanizacion,
    });
    return this.plazaRepository.save(plaza);
  }

  findAll() {
    return this.plazaRepository
      .createQueryBuilder("registro")
      .innerJoinAndSelect("registro.urbanizacion", "principal")
      .orderBy("registro.id", "ASC")
      .getMany();
  }

  findByUrbanizacion(principalId: number) {
    return this.plazaRepository
      .createQueryBuilder("registro")
      .innerJoinAndSelect("registro.urbanizacion", "principal")
      .where("principal.id = :principalId", { principalId })
      .orderBy("registro.id", "ASC")
      .getMany();
  }

  searchByName(text: string) {
    return this.plazaRepository
      .createQueryBuilder("registro")
      .innerJoinAndSelect("registro.urbanizacion", "principal")
      .where("registro.nombre ILIKE :pattern", { pattern: `%${text}%` })
      .orderBy("registro.id", "ASC")
      .getMany();
  }

  findByUrbanizacionAndMinimum(principalId: number, minimum: number) {
    return this.plazaRepository
      .createQueryBuilder("registro")
      .innerJoinAndSelect("registro.urbanizacion", "principal")
      .where("principal.id = :principalId", { principalId })
      .andWhere("registro.superficieM2 >= :minimum", { minimum })
      .orderBy("registro.superficieM2", "DESC")
      .getMany();
  }

  countByUrbanizacion() {
    return this.urbanizacionRepository
      .createQueryBuilder("principal")
      .leftJoin("principal.plazas", "registro")
      .select("principal.id", "id")
      .addSelect("principal.nombre", "nombre")
      .addSelect("COUNT(registro.id)", "total")
      .groupBy("principal.id")
      .addGroupBy("principal.nombre")
      .orderBy("principal.id", "ASC")
      .getRawMany();
  }
}
