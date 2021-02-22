import {Column, Entity, ObjectID, ObjectIdColumn} from 'typeorm';

@Entity()
export class Video {

  _id: ObjectID;

  @ObjectIdColumn()
  id: ObjectID;

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
