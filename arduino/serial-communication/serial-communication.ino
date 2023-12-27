#include <ArduinoJson.h>

class Module {
   private:
      int pin;
      char* moduleType;
      int lastValue;
      uint8_t mode;

  public:
    char* label;
    Module(int thePin, char* theModuleType, char* theLabel, uint8_t mode);
    StaticJsonDocument<200> json();
    int read();
    int getLastValue();
    void setValue(uint8_t newValue);
};

/*
    ####### Inputs #######
*/
Module button_fetch(2, "digital-pin", "button-fetch", INPUT);
Module button_checkout_develop(3, "digital-pin", "button-checkout-develop", INPUT);
Module button_checkout_master(4, "digital-pin", "button-checkout-master", INPUT);
Module button_checkout_feature(5, "digital-pin", "button-checkout-feature", INPUT);

const int buttons_count = 4;
Module buttons[4] = {
  button_fetch,
  button_checkout_develop,
  button_checkout_master,
  button_checkout_feature
};
/*
    ####### Inputs #######
*/

/*
    ####### Outputs #######
*/

const char d_changes[] = "d-changes";
const char d_error[] = "d-error";
const char d_develop[] = "d-develop";
const char d_master[] = "d-master";
const char d_feature[] = "d-feature";

Module diode_changes(9, "digital-pin", d_changes, OUTPUT);
Module diode_error(10, "digital-pin", d_error, OUTPUT);
Module diode_develop(11, "digital-pin", d_develop, OUTPUT);
Module diode_master(12, "digital-pin", d_master, OUTPUT);
Module diode_feature(13, "digital-pin", d_feature, OUTPUT);

const int diodes_count = 5;
Module diodes[5] = {
  diode_changes,
  diode_error,
  diode_develop,
  diode_master,
  diode_feature
};
/*
    ####### Outputs #######
*/

void setup() {
  Serial.begin(115200);
  while (!Serial) {
    ; // wait for serial port to connect. Needed for native USB port only
  }

  establishContact();  // send a byte to establish contact until receiver responds
}

void loop() {

  // READ by class
    for(int i = 0 ; i < buttons_count ; i++) {
      int oldValue = buttons[i].getLastValue();
      int currentValue = buttons[i].read();

      if(oldValue == currentValue) {
        continue;
      }

      // Send the JSON document over the "link" serial port
      serializeJson(buttons[i].json(), Serial);
      Serial.println();
      delay(300);
    }

    // Read the JSON document from the "link" serial port
    // Read the incoming data until a newline character '\n' is encountered
    while (Serial.available() > 0) { //{"pin": 0, "value": 1}
      String receivedString = Serial.readStringUntil('\n'); // Read the incoming byte
      delay(2); // Small delay for stability
    // Do something with the received string
      if (receivedString.length() > 0) {      
        StaticJsonDocument<300> doc;
    
        DeserializationError err = deserializeJson(doc, receivedString);
    
        if (err == DeserializationError::Ok)
        {
          const char* moduleIdentifier = doc["mi"];
          const int value = doc["v"].as<int>();

          for(int i = 0 ; i < diodes_count ; i++) {
            if(strcmp(moduleIdentifier, diodes[i].label) == 0) {
              diodes[i].setValue(value);
              break;
            }
          }
        }
        else
        {
          // Print error to the "debug" serial port
          Serial.print("{\"error\": \"deserializeJson() returned ");
          Serial.print(err.c_str());
          Serial.println("\"}");
                  // Print error to the "debug" serial port
          Serial.print("{\"received\": \"");
          Serial.print(receivedString);
          Serial.println("\"}");
    
          // Flush all bytes in the "link" serial port buffer
          while (Serial.available() > 0)
            Serial.read();
        }
      }
    }

}

void establishContact() {
  while (Serial.available() <= 0) {
      StaticJsonDocument<200> analogDoc;
      analogDoc["timestamp"] = millis();
      analogDoc["moduleType"] = "_bootstrap";
      analogDoc["moduleIdentifier"] = "_bootstrap";
      JsonObject payload  = analogDoc.createNestedObject("payload");
      payload["value"] = "Awaiting handshake bootstrap message from server...";

      // Send the JSON document over the "link" serial port
      serializeJson(analogDoc, Serial);

      Serial.println();

      delay(1000);
  }

  Serial.read();
}

Module::Module(int thePin, char* theModuleType, char* theLabel, uint8_t theMode)  {
      pin = thePin;
      moduleType = theModuleType;
      label = theLabel;
      mode = theMode;

      pinMode(pin, mode);
    }

StaticJsonDocument<200> Module::json() 
{
      StaticJsonDocument<200> doc;

      doc["timestamp"] = millis();
      doc["moduleType"] = "digital-pin";
      doc["moduleIdentifier"] = label;
      JsonObject payload  = doc.createNestedObject("payload");
      payload["value"] = lastValue;

      return doc;
}

int Module::read() 
{
  lastValue = digitalRead(pin);
  return lastValue;
}

int Module::getLastValue() 
{
  return lastValue;
}

void Module::setValue(uint8_t newValue) 
{
  digitalWrite(pin, newValue);
}
