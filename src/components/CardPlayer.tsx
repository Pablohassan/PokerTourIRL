import {
  Card,
  Button,
  CardHeader,
  Image,
  CardBody,
  CardFooter,
} from "@nextui-org/react";

interface CardPlayerProps {
  playername: string;
  recave: number;
  kill: number;
  rebuy: () => void;
  outOfGame: () => void;
}

export const CardPlayer: React.FC<CardPlayerProps> = ({
  playername,
  recave,
  kill,
  rebuy,
  outOfGame,
}) => {
  return (
    <Card style={{ width: "220px", height: "200px" }}>
      <CardHeader style={{ position: "absolute", zIndex: 1, top: 5 }}>
        <div>
          <div>{playername}</div>
        </div>
      </CardHeader>
      <CardBody style={{ padding: 0 }}>
        <Image
          src="https://nextui.org/images/card-example-6.jpeg"
          width="100%"
          height="100%"
          className="z-0 w-full h-full object-cover"
          alt="Card example background"
        />
      </CardBody>
      <CardFooter
        style={{
          backgroundColor: "#ffffff",

          position: "absolute",

          borderTop: "$borderWeights$light solid rgba(255, 255, 255, 0.2)",
          bottom: 0,
          zIndex: 1,
        }}
      >
        <div>
          <div>
            <div color="#000">Recaves:{recave}</div>
            <div color="#000">Kills:{kill}</div>
          </div>
          <div>
            <div>
              <Button
                size="sm"
                variant="bordered"
                color="secondary"
                onPress={rebuy}
              >
                <div
                  style={{
                    color: "inherit",
                    fontSize: 12,
                    fontWeight: "bold",
                    textTransform: "capitalize",
                  }}
                >
                  recave
                </div>
              </Button>
            </div>
            <div>
              <Button
                size="sm"
                variant="bordered"
                color="secondary"
                onPress={outOfGame}
              >
                <div
                  style={{
                    color: "inherit",
                    fontSize: 12,
                    fontWeight: "bold",
                    textTransform: "capitalize",
                  }}
                >
                  Eliminé
                </div>
              </Button>
            </div>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
};
