import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UrbanizacionController } from "../urbanizacion/urbanizacion.controller";
import { Urbanizacion } from "../urbanizacion/entities/urbanizacion.entity";
import { Plaza } from "./entities/plaza.entity";
import { PlazaController } from "./plaza.controller";
import { PlazaService } from "./plaza.service";

@Module({
  imports: [TypeOrmModule.forFeature([Urbanizacion, Plaza])],
  controllers: [PlazaController, UrbanizacionController],
  providers: [PlazaService],
})
export class PlazaModule {}
