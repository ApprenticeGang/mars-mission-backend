import {db} from "./database";
import {RoverName} from "../models/requestModels";
import { QueryBuilder } from "knex";

export interface TimelineItem {
    id: number;
    rover_name: string;
    image_url: string | null;
    heading: string;
    timeline_entry: string;
    date: string;
}

export interface NewTimelineItem {
    roverName: RoverName;
    imageUrl: string;
    heading: string;
    body: string;
    date: string;
}

export const getTimelineForRover = async (roverName: RoverName): Promise<TimelineItem[]> => {
    return db()
        .select("*")
        .from<TimelineItem>("timeline_entry")
        .where("rover_name", roverName)
        .orderBy("date", "desc");
};


export const insertTimelineItem = async (timelineItem: NewTimelineItem): Promise<void> => {
    await db()
        .insert({
            rover_name: timelineItem.roverName,
            image_url: timelineItem.imageUrl,
            heading: timelineItem.heading,
            timeline_entry: timelineItem.body,
            date: timelineItem.date
        })
        .into<TimelineItem>("timeline_entry");
};

export const getTimelineItemById = async (id: number, roverName: string): Promise<QueryBuilder> => {
    return db()
        .select("*")
        .from("timeline_entry")
        .where("id", id)
        .andWhere("rover_name", roverName)
        .first();
};

export const deleteTimelineItemById = async (id: number): Promise<void> => {
    await db()
        .delete()
        .from<TimelineItem>("timeline_entry")
        .where("id", id);
        
};
