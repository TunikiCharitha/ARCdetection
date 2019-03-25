#include <FilterDerivative.h>
#include <FilterOnePole.h>
#include <Filters.h>
#include <FilterTwoPole.h>
#include <FloatDefine.h>
#include <RunningStatistics.h>
#include <MPU6050_tockn.h>
#include <Wire.h>
#define LED_BUILTIN 13
MPU6050 mpu6050(Wire);

FilterOnePole lowpassFilter(LOWPASS, 9600);

float threshold,base;
void setup() {
  // put your setup code here, to run once:
  pinMode(LED_BUILTIN, OUTPUT);
  Serial.begin(9600);
  Wire.begin();
  mpu6050.begin();
  mpu6050.calcGyroOffsets(true);
  base=mpu6050.getAccZ();
}

float values[500];
int i=0;
void loop() {
   mpu6050.update();
   //base=mpu6050.getAccZ();
  //Serial.println("start");  
  /*if(i==500){
    while(1){};
  }
  lowpassFilter.input(-mpu6050.getAccZ()*10);
  Serial.println(lowpassFilter.output());
  i++;*/
  //Serial.println(mpu6050.getAccZ());
  threshold=12;
  if(-(mpu6050.getAccZ()-base)*10>=threshold){
    Serial.println("s");
    digitalWrite(LED_BUILTIN, HIGH);
    delay(200);                       // wait for a second
    digitalWrite(LED_BUILTIN, LOW);    // turn the LED off by making the voltage LOW
    delay(200);
    digitalWrite(LED_BUILTIN, HIGH);
    delay(200);
    digitalWrite(LED_BUILTIN, LOW);
    delay(200);
  }
  delay(150);
  
}                                                                                                                                                                                                                                        
