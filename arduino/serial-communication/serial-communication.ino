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

const byte numChars = 64;
char receivedChars[numChars];
char tempChars[numChars];        // temporary array for use when parsing

      // variables to hold the parsed data
char moduleIdentifier[numChars] = {0};
int value = 0;

boolean newData = false;

void setup() {
  for(int i = 0 ; i < diodes_count ; i++) {
    diodes[i].setValue(1);
  }

  Serial.begin(250000);
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
    }

    // Read the JSON document from the "link" serial port
    // Read the incoming data until a newline character '\n' is encountered
    // message: {"mi":"d-master","v":"1"}\n

    recvWithStartEndMarkers();
    strcpy(tempChars, receivedChars);
    parseData();

    for(int i = 0 ; i < diodes_count ; i++) {
      if(strcmp(moduleIdentifier, diodes[i].label) == 0) {
        diodes[i].setValue(value);
        break;
      }
    }
    newData = false;
}

void parseData() {      // split the data into its parts

    char * strtokIndx; // this is used by strtok() as an index

    strtokIndx = strtok(tempChars,",");      // get the first part - the string
    strcpy(moduleIdentifier, strtokIndx); // copy it to messageFromPC
 
    strtokIndx = strtok(NULL, ",");
    value = atoi(strtokIndx);     // convert this part to a float

}

void recvWithStartEndMarkers() {
    static boolean recvInProgress = false;
    static byte ndx = 0;
    char startMarker = '<';
    char endMarker = '>';
    char rc;
 
    while (Serial.available() > 0 && newData == false) {
        rc = Serial.read();

        if (recvInProgress == true) {
            if (rc != endMarker) {
                receivedChars[ndx] = rc;
                ndx++;
                if (ndx >= numChars) {
                    ndx = numChars - 1;
                }
            }
            else {
                receivedChars[ndx] = '\0'; // terminate the string
                recvInProgress = false;
                ndx = 0;
                newData = true;
            }
        }

        else if (rc == startMarker) {
            recvInProgress = true;
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

  while (Serial.available() > 0) {
      Serial.read();
  }
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
