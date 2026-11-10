import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
} from "@nestjs/common";
import { PlazaService } from "./plaza.service";

@Controller("plazas")
export class PlazaController {
  constructor(private readonly plazaService: PlazaService) {}

  @Get()
  findAll() {
    return this.plazaService.findAll();
  }

  @Get("urbanizacion/:principalId")
  findByUrbanizacion(@Param("principalId", ParseIntPipe) principalId: number) {
    return this.plazaService.findByUrbanizacion(principalId);
  }

  @Get("buscar")
  searchByName(@Query("texto") text: string) {
    return this.plazaService.searchByName(text || "");
  }

  @Get("urbanizacion/:principalId/minimo/:minimum")
  findByUrbanizacionAndMinimum(
    @Param("principalId", ParseIntPipe) principalId: number,
    @Param("minimum", ParseIntPipe) minimum: number,
  ) {
    return this.plazaService.findByUrbanizacionAndMinimum(principalId, minimum);
  }

  @Get("resumen/urbanizacion")
  countByUrbanizacion() {
    return this.plazaService.countByUrbanizacion();
  }

  @Post()
  create(
    @Body()
    body: {
      nombre: string;
      superficieM2: number;
      urbanizacionId: number;
    },
  ) {
    return this.plazaService.createPlaza(
      body.nombre,
      body.superficieM2,
      body.urbanizacionId,
    );
  }

  @Delete(":id")
  eliminar(@Param("id", ParseIntPipe) id: number) {
    return this.plazaService.eliminarPlaza(id);
  }

  @Delete("urbanizacion/:principalId")
  eliminarPorUrbanizacion(
    @Param("principalId", ParseIntPipe) principalId: number,
  ) {
    return this.plazaService.eliminarPorUrbanizacion(principalId);
  }

  @Patch(":id/urbanizacion")
  cambiarPrincipal(
    @Param("id", ParseIntPipe) id: number,
    @Body() body: { principalId?: number; urbanizacionId?: number },
  ) {
    const nuevoId = body.principalId ?? body.urbanizacionId ?? 0;
    return this.plazaService.cambiarPrincipal(id, nuevoId);
  }

  @Patch(":id")
  modificar(
    @Param("id", ParseIntPipe) id: number,
    @Body() body: { nombre?: string; superficieM2?: number },
  ) {
    return this.plazaService.modificarPlaza(id, body);
  }
}
