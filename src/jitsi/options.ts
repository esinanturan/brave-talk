import { config } from "../environment";
import { getLangPref } from "../get-language-detector";
import { JitsiOptions } from "./types";
import { reportAction } from "../lib";

export const jitsiOptions = (
  roomName: string,
  el: Element | null,
  jwt: string,
  isMobile?: boolean,
): JitsiOptions => {
  const options = {
    roomName: config.vpaas + "/" + roomName,
    jwt: jwt,
    parentNode: el,
    lang: getLangPref(),

    configOverwrite: {
      analytics: {
        disabled: true,
        rtcstatsEnabled: false,
      },
      brandingRoomAlias: roomName,
      callStatsID: false,
      callStatsSecret: false,
      conferenceInfo: {
        autoHide: [
          "subject",
          "conference-timer",
          "participants-count",
          "e2ee",
          "transcribing",
          "video-quality",
          "insecure-room",
          // "highlight-moment"
          "top-panel-toggle",
        ],
      },
      disabledSounds: ["E2EE_OFF_SOUND", "E2EE_ON_SOUND"],
      disableGTM: true,
      doNotStoreRoom: true,
      disableBeforeUnloadHandlers: true,
      disableInviteFunctions: false,
      disableTileEnlargement: true,
      dropbox: {
        appKey: null,
      },
      e2eeLabels: {
        e2ee: "Video Bridge Encryption",
        labelToolTip:
          "Audio and Video Communication on this call is encrypted on the video bridge",
        description:
          "Video Bridge Encryption is currently EXPERIMENTAL. Please keep in mind that turning it on will effectively disable server-side provided services such as: phone participation. Also keep in mind that the meeting will only work for people joining from browsers with support for insertable streams.  Note that chats will not use this encryption.",
        label: "Enable Video Bridge Encryption",
        warning:
          "WARNING: Not all participants in this meeting seem to have support for Video Bridge Encryption. If you enable it they won't be able to see nor hear you.",
      },
      enableTalkWhileMuted: false,
      faceLandmarks: {
        enableFaceExpressionsDetection: false,
        enableDisplayFaceExpressions: false,
      },
      giphy: {
        enabled: false,
      },
      hideEmailInSettings: true,
      inviteAppName: "Brave Talk",
      localSubject: "Brave Talk",
      prejoinPageEnabled: true,
      recordings: {
        recordAudioAndVideo: false,
      },
      resolution: isMobile ? 360 : undefined,
      roomPasswordNumberOfDigits: false,
      startWithAudioMuted: true,
      startWithVideoMuted: true,
      localRecording: {
        disable: true,
      },
      toolbarConfig: {
        autoHideWhileChatIsOpen: true,
      },
      // taken from https://github.com/jitsi/jitsi-meet/blob/master/react/features/base/config/constants.ts#L16
      toolbarButtons: [
        "camera",
        "chat",
        "desktop",
        "download",
        "embedmeeting",
        "etherpad",
        "feedback",
        "filmstrip",
        "fullscreen",
        "hangup",
        "help",
        "highlight",
        "invite",
        "linktosalesforce",
        "livestreaming",
        "microphone",
        "mute-everyone",
        "mute-video-everyone",
        "participants-pane",
        "profile",
        "raisehand",
        // added to help de-clutter hand raising and gestures
        "reactions",
        "recording",
        "security",
        "select-background",
        "settings",
        "shareaudio",
        "noisesuppression",
        "sharedvideo",
        "shortcuts",
        "stats",
        "tileview",
        "toggle-camera",
        "videoquality",
        "whiteboard",
      ],
      transcribingEnabled: true,
      useHostPageLocalStorage: true,
      videoQuality: {
        persist: true,
      },
    },

    interfaceConfigOverwrite: {
      APP_NAME: "Brave Talk",
      DEFAULT_BACKGROUND: "#3B3E4F",
      DISABLE_DOMINANT_SPEAKER_INDICATOR: true,
      DISABLE_TRANSCRIPTION_SUBTITLES: false,
      // a no-op
      JITSI_WATERMARK_LINK: "https://brave.com",
      PROVIDER_NAME: "Brave",
      // remove 'dial-in'
      SHARING_FEATURES: ["email", "url", "embed"],
      SHOW_CHROME_EXTENSION_BANNER: false,
      SUPPORT_URL: "https://community.brave.com/",
    },

    onload: () => {
      document.title = options.interfaceConfigOverwrite.APP_NAME;
    },
  };

  const features = jwt_decode(jwt)?.context?.features;

  reportAction("features", { features });

  Object.entries(features).forEach(([feature, state]) => {
    if (state === "true") {
      if (feature === "recording") {
        options.configOverwrite.conferenceInfo.autoHide.push(
          "highlight-moment",
        );
      }
    }
  });

  return options;
};
