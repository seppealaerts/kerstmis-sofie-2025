import Slide from "../Slide";
import { Text } from "@radix-ui/themes";

export default function Slide1() {
  return (
    <Slide emoji="🎅" title="Dag Sofie">
      <Text size="4">Ik ben het, de Kerstman!</Text>
      <Text size="4" style={{ marginTop: "1rem" }}>
        Ik heb gehoord dat jij het soms moeilijk hebt met het (terug)vinden van
        bepaalde voorwerpen...
      </Text>
      <Text size="4" style={{ marginTop: "1rem" }}>
        Weet je wat? We nemen gewoon de proef op de som.
      </Text>
    </Slide>
  );
}
