import {
  DownloadedTranscript,
  parseTranscriptLines,
} from "../downloaded-transcript";
import { useEffect, useState } from "react";
import { css } from "@emotion/react";

interface MeetingTranscriptProps {
  transcript: DownloadedTranscript;
}

interface MeetingTranscriptDisplayProps {
  transcriptId: string;
  transcriptUrlBase?: string;
}

const styles = {
  container: css({
    backgroundColor: "white",
    maxWidth: "600px",
    color: "black",
    textAlign: "left",
    margin: "20px auto",
    padding: "1em",
  }),
  table: css({
    display: "table",
    margin: "1em",
  }),
  row: css({
    display: "table-row",
  }),
  cell: css({
    display: "table-cell",
  }),
  actor: css({
    fontWeight: "bold",
    paddingRight: "1em",
  }),
  action: css({
    fontStyle: "italic",
    color: "red",
  }),
  message: css({}),
};

const COLORS = [
  "seagreen",
  "salmon",
  "blue",
  "orange",
  "black",
  "#BADA55",
  "purple",
  "chocolate",
];

export const MeetingTranscript = ({ transcript }: MeetingTranscriptProps) => {
  const participantColorMap = new Map<string, string>();
  let counter = 0;
  transcript.events.forEach((e) => {
    const color = participantColorMap.get(e.participant);
    if (!color) {
      participantColorMap.set(e.participant, COLORS[counter++ % COLORS.length]);
    }
  });

  return (
    <div css={styles.container}>
      <h1>Meeting Transcript</h1>
      <a href={transcript.url}>Download</a>
      <h2>{transcript.startDateTime}</h2>
      <div css={styles.table}>
        {transcript.events.map((event, i) =>
          event.action ? (
            <div css={styles.row} key={i}>
              <div
                css={[
                  styles.cell,
                  styles.actor,
                  { color: participantColorMap.get(event.participant) },
                ]}
              >
                {event.participant}
              </div>
              <div css={[styles.cell, styles.action]}>
                <p>{event.message}</p>
              </div>
            </div>
          ) : (
            <div css={styles.row} key={i}>
              <div
                css={[
                  styles.cell,
                  styles.actor,
                  { color: participantColorMap.get(event.participant) },
                ]}
              >
                {event.participant}
              </div>
              <div css={[styles.cell, styles.message]}>
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
  transcriptId,
  transcriptUrlBase,
}: MeetingTranscriptDisplayProps) => {
  const [transcript, setTranscript] = useState<
    DownloadedTranscript | undefined
  >();

  useEffect(() => {
    const transcriptUrl =
      (transcriptUrlBase || "/api/v1/transcripts/") + transcriptId;
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
  }, [transcriptId, transcriptUrlBase]);

  return transcript ? (
    <MeetingTranscript transcript={transcript} />
  ) : (
    <p>Loading</p>
  );
};

export default MeetingTranscript;
