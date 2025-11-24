import { type Handler } from "hono";
import { streamText } from "hono/streaming";
import { v4 as uuidv4 } from "uuid";

let videos: Video[] = [];

export const sendAllVideos: Handler = (c) => {
	return streamText(c, async (stream) => {
		for (const video of videos) {
			await stream.writeln(JSON.stringify(video));
			await stream.sleep(1000);
		}
	});
};

export const sendAVideo: Handler = async (c) => {
	const id = c.req.param("id");

	const video = videos.find((video) => video.id === id);

	if (!video) return c.json({ message: "Video not found" }, 404);

	return c.json(video);
};

export const saveVideo: Handler = async (c) => {
	const { videoName, channelName, duration } = await c.req.json();

	const newVideo = {
		id: uuidv4(),
		videoName,
		channelName,
		duration,
	};

	videos.push(newVideo);

	return c.json(newVideo);
};

export const updateVideo: Handler = async (c) => {
	const id = c.req.param("id");

	const videoIndex = videos.findIndex((video) => video.id === id);

	if (videoIndex === -1) return c.json({ message: "Video not found" }, 404);

	const { videoName, channelName, duration } = await c.req.json();

	videos[videoIndex] = {
		...videos[videoIndex],
		videoName,
		channelName,
		duration,
	};

	return c.json(videos[videoIndex]);
};

export const deleteAVideo: Handler = async (c) => {
	const id = c.req.param("id");

	videos = videos.filter((video) => video.id !== id);

	return c.json({ message: "The video was deleted!" });
};

export const deleteAllVideos: Handler = (c) => {
	videos = [];

	return c.json({ message: "All videos deleted!" });
};
