
import React from "react";

interface MoodistEmbedProps {
  height?: string;
}

const MoodistEmbed: React.FC<MoodistEmbedProps> = ({ height = "400px" }) => {
  return (
    <div className="w-full overflow-hidden rounded-xl" style={{ height }}>
      <iframe
        src="https://moodist.app"
        title="Moodist App"
        className="w-full h-full border-0"
        style={{ borderRadius: "16px" }}
        allow="autoplay"
      />
    </div>
  );
};

export default MoodistEmbed;
