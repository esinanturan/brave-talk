import {
  DownloadedTranscript,
  parseTranscriptLines,
} from "../downloaded-transcript";
import { useEffect, useState } from "react";

interface MeetingTranscriptProps {
  transcript: DownloadedTranscript;
}

interface MeetingTranscriptDisplayProps {
  transcriptUrl: string;
}

export const MeetingTranscript = ({ transcript }: MeetingTranscriptProps) => {
  return (
    <div>
      <h1>Meeting Transcript</h1>
      <a href={transcript.url}>Download</a>
      <h2>{transcript.startDateTime}</h2>
      <div>
        {transcript.events.map((event, i) =>
          event.action ? (
            <div key={i}>
              <div>{event.participant}</div>
              <div>
                <p>{event.message}</p>
              </div>
            </div>
          ) : (
            <div key={i}>
              <div>{event.participant}</div>
              <div>
                <p>{event.message}</p>
              </div>
            </div>
          ),
        )}
      </div>
    </div>
  );
};

export const MeetingTranscriptDisplay = ({
  transcriptUrl,
}: MeetingTranscriptDisplayProps) => {
  const [transcript, setTranscript] = useState<
    DownloadedTranscript | undefined
  >();

  useEffect(() => {
    fetch(transcriptUrl)
      .then((r) => r.text())
      .then(parseTranscriptLines)
      .then((events) => {
        setTranscript({
          url: transcriptUrl,
          events,
          startDateTime: "whatever",
        });
      });
  }, [transcriptUrl]);

  return transcript ? (
    <MeetingTranscript transcript={transcript} />
  ) : (
    <p>Loading</p>
  );
};

export default MeetingTranscript;
