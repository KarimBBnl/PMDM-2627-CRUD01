import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Plaza } from "../../plaza/entities/plaza.entity";

@Entity("urbanizaciones")
export class Urbanizacion {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: "varchar", length: 120 })
  nombre!: string;

  @OneToMany(() => Plaza, (plaza) => plaza.urbanizacion)
  plazas!: Plaza[];
}
