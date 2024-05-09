import {
  DownloadedTranscript,
  parseTranscriptLines,
} from "../downloaded-transcript";
import { useEffect, useState } from "react";
import { css } from "@emotion/react";
import TranscriptImage from "../images/papyrus.svg";
import DownloadImage from "../images/download_color.svg";
import { formatRelativeDay } from "../recordings-utils";

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
    color: "black",
    textAlign: "left",
    width: "612px",
    paddingTop: "20px",
    paddingBottom: "36px",
    paddingLeft: "28px",
    paddingRight: "28px",
    margin: "69px auto 16px",
    background: "white",
    backdropFilter: "blur(32px)",
    borderRadius: "24px",
    "@media only screen and (max-width: 812px)": {
      width: "100%",
    },
  }),
  dateTime: css({
    margin: "0 1em",
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
    paddingRight: "1.3em",
  }),
  action: css({
    fontStyle: "italic",
    color: "red",
  }),
  message: css({}),
  downloadLink: css({
    border: "1px solid #daddfd",
    padding: "7px",
    borderRadius: "9px",
    textDecoration: "none",
    color: "#736fee",
    fontWeight: "bold",
    float: "right",
  }),
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
  let participantCounter = 0;
  const { events, startDateTime } = transcript;
  events.forEach((e) => {
    const color = participantColorMap.get(e.participant);
    if (!color) {
      participantColorMap.set(
        e.participant,
        COLORS[participantCounter++ % COLORS.length],
      );
    }
  });

  return (
    <div css={styles.container}>
      <div>
        <a
          css={styles.downloadLink}
          target="_blank"
          rel="noreferrer"
          href={transcript.url}
        >
          <img
            src={DownloadImage}
            height="16"
            width="18"
            alt="download"
            css={{ marginBottom: "-1px" }}
          />{" "}
          Download
        </a>
        <h1
          css={{
            marginLeft: "0.5em",
          }}
        >
          <img src={TranscriptImage} height="22" width="22" alt="transcript" />{" "}
          Meeting Transcript
        </h1>
      </div>
      {startDateTime && (
        <p css={styles.dateTime}>
          <strong>{formatRelativeDay(startDateTime)}</strong>
          {", "}
          {startDateTime.toLocaleTimeString()}{" "}
        </p>
      )}
      <div css={styles.table}>
        {events.map((event, i) =>
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
          startDateTime:
            window.history.state?.startDateTime &&
            new Date(window.history.state.startDateTime),
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
