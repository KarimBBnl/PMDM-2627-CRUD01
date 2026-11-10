import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
} from "@nestjs/common";
import { PlazaService } from "../plaza/plaza.service";

@Controller("urbanizaciones")
export class UrbanizacionController {
  constructor(private readonly plazaService: PlazaService) {}

  @Get()
  findAll() {
    return this.plazaService.findAllUrbanizaciones();
  }

  @Get(":id")
  findOne(@Param("id", ParseIntPipe) id: number) {
    return this.plazaService.findOneUrbanizacion(id);
  }

  @Post()
  create(@Body() body: { nombre: string }) {
    return this.plazaService.createUrbanizacion(body.nombre);
  }

  @Patch(":id")
  modificar(
    @Param("id", ParseIntPipe) id: number,
    @Body() body: { nombre: string },
  ) {
    return this.plazaService.modificarUrbanizacion(id, body.nombre);
  }

  @Delete(":id")
  eliminar(@Param("id", ParseIntPipe) id: number) {
    return this.plazaService.eliminarUrbanizacion(id);
  }
}
