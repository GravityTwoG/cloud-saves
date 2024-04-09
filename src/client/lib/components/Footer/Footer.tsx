import { useAPIContext } from "@/client/contexts/APIContext";
import { Flex } from "@/client/ui/atoms/Flex";
import { Paragraph } from "@/client/ui/atoms/Typography";
import { useEffect, useState } from "react";

export const Footer = () => {
  const { osAPI } = useAPIContext();

  const [version, setVersion] = useState<string>("");

  useEffect(() => {
    osAPI.getAppVersion().then(setVersion).catch(console.error);
  }, [osAPI]);

  return (
    <Flex jcc className="my-2">
      <Paragraph>v{version}</Paragraph>
    </Flex>
  );
};
