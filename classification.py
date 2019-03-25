from pandas import pandas
import matplotlib.pyplot as plt
colnames = ['timestamp','x','y','accx','accy','accz','gyrox','gyroy','gyroz']
df = pandas.read_csv('database.csv',names=colnames)
colnames1 = ['timestamp','condition']
db=pandas.read_csv('databaseARC.csv',names=colnames1)
timestamp=df.timestamp.tolist()
timestamp1=db.timestamp.tolist()
accy= df.accy.tolist()
del accy[0]
del timestamp[0]
del timestamp1[0]
ind=[]
for t1 in timestamp1:
	if t1 in timestamp:
		ind.append(timestamp.index(t1))
a=[]
for i in ind:
	acc=[]
	j=0
	for j in range(50):
		acc.append(accy[i+j])
#print(a)
#accy = list(dict.fromkeys(accy))
acc=[]
for i in accy:
	acc.append(float(i))
y=[-10]*43

plt.rcParams["font.size"] =7
plt.plot(timestamp,acc)
plt.scatter(timestamp1,y,color='red')
plt.show()



