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
    <Card style={{ width: "130px", height: "180px" }}>
      <CardHeader style={{ position: "absolute", zIndex: 1, top: 5 }}>
      
          <div className="text-lg" >{playername}</div>
      
      </CardHeader>
     
        <Image
          src="https://nextui.org/images/card-example-6.jpeg"
          width="100%"
          height="100%"
          className="z-0 w-full h-full object-cover"
          alt="Card example background"
        />
   
   
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
            <div className="text-lg" color="#000">Recaves:{recave}</div>
            <div className="text-lg" color="#000">Kills:{kill}</div>
          </div>
          <div>
            <div>
              <Button
                size="sm"
                variant="bordered"
                color="secondary"
                onClick={(e) => {
                  rebuy();
                  e.currentTarget.blur(); // Add this line to blur the button
                }}
              >
                <div 
                className="p-1"
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
            <div className="p1">
              <Button
                size="sm"
                variant="bordered"
                color="secondary"
                onClick={(e) => {
                  outOfGame();
                  e.currentTarget.blur(); // Add this line to blur the button
                }}
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
