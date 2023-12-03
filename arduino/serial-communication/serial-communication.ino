#include <ArduinoJson.h>

struct Module {
  String moduleType;
  int moduleIdentifier;
  int value;
};

int digitalInputs [5] = {2, 3, 4, 5, 6};
int digitalValues [5] = {0, 0, 0, 0, 0};

int digitalOutputs [5] = {7, 8, 9, 10, 11};

int analogInputs [3] = {A0, A1, A2};
int analogInputsValues [3] = {0, 0 ,0};


void setup() {
  // start serial port at 9600 bps:
  Serial.begin(115200);
  while (!Serial) {
    ; // wait for serial port to connect. Needed for native USB port only
  }

  pinMode(2, INPUT);

  pinMode(7, OUTPUT);
  pinMode(8, OUTPUT);
  pinMode(9, OUTPUT);
  pinMode(10, OUTPUT);
  pinMode(11, OUTPUT);

    // digital sensor is on digital pin 0
  establishContact();  // send a byte to establish contact until receiver responds
}

void loop() {
    for(int i = 0 ; i < 5 ; i++) {
      int digitalValue = digitalRead(digitalInputs[i]);
      int previousValue = digitalValues[i];
      digitalValues[i] = digitalValue;

      if(previousValue == digitalValue) {
        continue;
      }

      StaticJsonDocument<200> doc;
      doc["timestamp"] = millis();
      doc["moduleType"] = "digital-pin";
      doc["moduleIdentifier"] = digitalInputs[i];
      JsonObject payload  = doc.createNestedObject("payload");
      payload["value"] = digitalValue;
    
      // Send the JSON document over the "link" serial port
      serializeJson(doc, Serial);
      Serial.println();
    }

    for(int i = 0 ; i < 3 ; i++) {
      int analogReadValue = analogRead(analogInputs[i]);
      int previousValue = analogInputsValues[i];
      analogInputsValues[i] = analogReadValue;

      if((analogReadValue > previousValue - 2) && (analogReadValue < previousValue + 2)) {
        continue;
      }

      StaticJsonDocument<200> analogDoc;
      analogDoc["timestamp"] = millis();
      analogDoc["moduleType"] = "analog-pin";
      analogDoc["moduleIdentifier"] = analogInputs[i];
      JsonObject payload  = analogDoc.createNestedObject("payload");
      payload["value"] = analogReadValue;
      
      // Send the JSON document over the "link" serial port
      serializeJson(analogDoc, Serial);
      Serial.println();
    }

    // Read the JSON document from the "link" serial port

    String receivedString = ""; // Initialize an empty string to store incoming data

    // Read the incoming data until a newline character '\n' is encountered
    while (Serial.available() > 0) {
      char incomingChar = Serial.read(); // Read the incoming byte
      if (incomingChar == '\n') {
        break; // Break the loop when newline character is received
      }
      receivedString += incomingChar; // Append the character to the received string
//       delay(2); // Small delay for stability
    }

    // Do something with the received string
    if (receivedString.length() > 0) {      
      StaticJsonDocument<300> doc;
  
      DeserializationError err = deserializeJson(doc, receivedString);
  
      if (err == DeserializationError::Ok)
      {
  
        if(doc["mt"] == "dp") {
          digitalWrite(doc["mi"].as<int>(), doc["v"].as<int>());
        }
        else if(doc["mt"] == "ap") {
          analogWrite(doc["mi"].as<int>(), doc["v"].as<int>());
        }
        else {
          Serial.println("Unknown module type");
        }
      }
      else
      {
        // Print error to the "debug" serial port
        Serial.print("deserializeJson() returned ");
        Serial.println(err.c_str());
  
        // Flush all bytes in the "link" serial port buffer
        while (Serial.available() > 0)
          Serial.read();
      }
    }

}

void establishContact() {
  while (Serial.available() <= 0) {
      StaticJsonDocument<200> analogDoc;
      analogDoc["timestamp"] = millis();
      analogDoc["moduleType"] = "_bootstrap";
      analogDoc["moduleIdentifier"] = "";
      JsonObject payload  = analogDoc.createNestedObject("payload");
      payload["value"] = "Awaiting handshake bootstrap message from server...";

      // Send the JSON document over the "link" serial port
      serializeJson(analogDoc, Serial);

      Serial.println();

      delay(1000);
  }

  Serial.read();
}
