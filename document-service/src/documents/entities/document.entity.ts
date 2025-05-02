import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';

@Entity({ name: 'documents' })
export class DocumentEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  ownerId!: string;         // l’ID de l’utilisateur (JWT sub)

  @Column()
  title: string;

  @Column()
  fileName!: string;        // nom original du fichier

  // @Column()
  // mimeType!: string;        // ex. 'application/pdf'

  // @CreateDateColumn()
  // uploadDate!: Date;        // date & heure du téléversement
}