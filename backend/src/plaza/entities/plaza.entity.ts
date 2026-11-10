import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Urbanizacion } from "../../urbanizacion/entities/urbanizacion.entity";

@Entity("plazas")
export class Plaza {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: "varchar", length: 120 })
  nombre!: string;

  @Column({ name: "superficieM2", type: "integer" })
  superficieM2!: number;

  @ManyToOne(() => Urbanizacion, (urbanizacion) => urbanizacion.plazas, {
    nullable: false,
    onDelete: "RESTRICT",
  })
  @JoinColumn({ name: "urbanizacion_id" })
  urbanizacion!: Urbanizacion;
}
