import {Column, Entity, ObjectIdColumn} from 'typeorm/index';

@Entity()
export class Video {

  @ObjectIdColumn()
  id: number;

  @Column()
  season: string;

  @Column()
  series: string;

  @Column()
  part: string;

  @Column()
  date: string;

  @Column()
  link: string;

  @Column()
  thumbnail: string;

  @Column()
  url: string;

  segmentsUrl: string;

  @Column()
  preview: string;
}
