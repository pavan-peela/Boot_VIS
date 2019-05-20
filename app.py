from flask import Flask, render_template, request
import pandas as pd
import numpy as np
import json


app = Flask(__name__)


dataset_file = pd.read_csv('Project_Dataset/fifa-18-dataset/CompleteDataset.csv', header = 0, nrows=10000)
dataset_full = pd.read_csv('Project_Dataset/fifa-18-dataset/CompleteDataset.csv', header = 0, nrows=10000)
Filter = [
    'Name', 
    'Age', 
    'Nationality', 
    'Overall', 
    'Potential', 
    'Club', 
    'Value', 
    'Wage', 
    'Preferred Positions'
]

dataset = pd.DataFrame(dataset_file, columns=Filter)

dataset = dataset.drop_duplicates(subset='Name')
dataset_full = dataset_full.drop_duplicates(subset='Name')

print(dataset_full.columns)
dataset_full = dataset_full.drop(['Photo','Flag','Club Logo', 'ID'], axis=1)
#data cleaning
def str2number(amount):
    if amount[-1] == 'M':
        return float(amount[1:-1])*1000000
    elif amount[-1] == 'K':
        return float(amount[1:-1])*1000
    else:
        return float(amount[1:])
    
dataset['ValueNum'] = dataset['Value'].apply(lambda x: str2number(x))
dataset['WageNum'] = dataset['Wage'].apply(lambda x: str2number(x))

dataset_full['ValueNum'] = dataset_full['Value'].apply(lambda x: str2number(x))
dataset_full['WageNum'] = dataset_full['Wage'].apply(lambda x: str2number(x))

# print('null',dataset['Name'].isna().sum())
for each in dataset.columns:
    print(each + ' : ' + str(dataset[each].isna().sum()))
dataset['position'] = dataset['Preferred Positions'].apply(lambda x: x.split(" ")[0])
# print(dataset['position'].unique())
dataset_full['position'] = dataset_full['Preferred Positions'].apply(lambda x: x.split(" ")[0])


#divide players into ten classes basing on their value and income
max_value = float(dataset['ValueNum'].max() + 1)
max_wage = float(dataset['WageNum'].max() + 1)
# Supporting function for creating category columns 'ValueCategory' and 'WageCategory'
def mappingAmount(x, max_amount):
    for i in range(0, 10):
        if x >= max_amount/10*i and x < max_amount/10*(i+1):
            return i
        
dataset['ValueCategory'] = dataset['ValueNum'].apply(lambda x: mappingAmount(x, max_value))
dataset['WageCategory'] = dataset['WageNum'].apply(lambda x: mappingAmount(x, max_wage))

#will contain two categories 0 and 1 and inform if player value/wage is highier then mean value.
mean_value = float(dataset["ValueNum"].mean())
mean_wage = float(dataset["WageNum"].mean())
# Supporting function for creating category columns 'OverMeanValue' and 'OverMeanWage'
def overValue(x, limit):
    if x > limit:
        return 1
    else:
        return 0
    
dataset['OverMeanValue'] = dataset['ValueNum'].apply(lambda x: overValue(x, mean_value))
dataset['OverMeanWage'] = dataset['WageNum'].apply(lambda x: overValue(x, mean_wage))
dataset['PotentialPoints'] = dataset['Potential'] - dataset['Overall']
dataset['Position'] = dataset['Preferred Positions'].str.split().str[0]
dataset['PositionNum'] = dataset['Preferred Positions'].apply(lambda x: len(x.split()))
# print(dataset['Position'])
dataset['pre_pos'] = dataset['Preferred Positions']


# List of countries for each continent
continents = {
    'Africa' : ['Algeria','Angola','Benin','Botswana','Burkina','Burundi','Cameroon','Cape Verde','Central African Republic','Chad','Comoros','Congo','DR Congo','Djibouti','Egypt','Equatorial Guinea','Eritrea','Ethiopia','Gabon','Gambia','Ghana','Guinea','Guinea Bissau','Ivory Coast','Kenya','Lesotho','Liberia','Libya','Madagascar','Malawi','Mali','Mauritania','Mauritius','Morocco','Mozambique','Namibia','Niger','Nigeria','Rwanda','Sao Tome and Principe','Senegal','Seychelles','Sierra Leone','Somalia','South Africa','South Sudan','Sudan','Swaziland','Tanzania','Togo','Tunisia','Uganda','Zambia','Zimbabwe','Burkina Faso'],
    'Antarctica' : ['Fiji','Kiribati','Marshall Islands','Micronesia','Nauru','New Zealand','Palau','Papua New Guinea','Samoa','Solomon Islands','Tonga','Tuvalu','Vanuatu'],
    'Asia' : ['Afghanistan','Bahrain','Bangladesh','Bhutan','Brunei','Burma (Myanmar)','Cambodia','China','China PR','East Timor','India','Indonesia','Iran','Iraq','Israel','Japan','Jordan','Kazakhstan','North Korea','South Korea','Korea Republic','Korea DPR','Kuwait','Kyrgyzstan','Laos','Lebanon','Malaysia','Maldives','Mongolia','Nepal','Oman','Pakistan','Palestine','Philippines','Qatar','Russian Federation','Saudi Arabia','Singapore','Sri Lanka','Syria','Tajikistan','Thailand','Turkey','Turkmenistan','United Arab Emirates','Uzbekistan','Vietnam','Yemen','Russia'],
    'Australia Oceania' : ['Australia','New Caledonia'],
    'Europe' : ['Albania','Andorra','Armenia','Austria','Azerbaijan','Belarus','Belgium','Bosnia Herzegovina','Bulgaria','Croatia','Cyprus','Czech Republic','Denmark','Estonia','Finland','France','FYR Macedonia','Georgia','Germany','Greece','Hungary','Iceland','Ireland','Italy','Kosovo','Latvia','Liechtenstein','Lithuania','Luxembourg','Macedonia','Malta','Moldova','Monaco','Montenegro','Netherlands','Northern Ireland','Norway','Poland','Portugal','Romania','San Marino','Scotland','Serbia','Slovakia','Slovenia','Spain','Sweden','Switzerland','Ukraine','England','Vatican City','Republic of Ireland','Wales'],
    'North America' : ['Antigua and Barbuda','Bahamas','Barbados','Belize','Canada','Costa Rica','Cuba','Dominica','Dominican Republic','El Salvador','Grenada','Guatemala','Haiti','Honduras','Jamaica','Mexico','Nicaragua','Panama','Saint Kitts and Nevis','Saint Lucia','Saint Vincent and the Grenadines','Trinidad and Tobago','United States'],
    'South America' : ['Argentina','Bolivia','Brazil','Chile','Colombia','Curacao','Ecuador','Guyana','Paraguay','Peru','Suriname','Trinidad & Tobago','Uruguay','Venezuela']
}

# Function matching continent to countries
def find_continent(x, continents_list):
    # Iteration over 
    for key in continents_list:
        if x in continents_list[key]:
            return key
    return np.NaN

dataset['Continent'] = dataset['Nationality'].apply(lambda x: find_continent(x, continents))
dataset_full['Continent'] = dataset_full['Nationality'].apply(lambda x: find_continent(x, continents))
dataset['total'] = 1
dataset_full['total'] = 1
dataset['json'] = dataset.apply(lambda x: x.to_json(), axis=1)
dataset.dropna(how='any', inplace=True)
dataset_full.dropna(how='any', inplace=True)
print(dataset['Club'].isnull().sum())
# dataset.to_json('temp.json', orient='records', lines=True)
# print(dataset['json'])


top_1000 = dataset.sort_values("Overall", ascending=False).reset_index().head(500)[["Name", "Nationality", "Continent", "Overall", "Club"]]
# print(top_1000)
Africa = top_1000[top_1000["Continent"]=='Africa']
Antarctica = top_1000[top_1000["Continent"]=='Antarctica']
Asia = top_1000[top_1000["Continent"]=='Asia']
Australia_Oceania =  top_1000[top_1000["Continent"]=='Australia_Oceania']
Europe = top_1000[top_1000["Continent"]=='Europe']
North_america = top_1000[top_1000["Continent"]=='North_america']
South_america = top_1000[top_1000["Continent"]=='South_america']

data = {}
data1={}
data["name"] = "DISTRIBUTION OF TOP 1000 PLAERS DUE TO NATIONALITY"
data["children"] = []
data1["name"]="count per continent"
data1["children"] = []
data1["dataset"]=[]

# Split dataset into Continents:
for continent in top_1000['Continent'].unique():
    
    continent_set = top_1000[top_1000["Continent"]==continent]
    continent_dict = {}
    counter={}
    counter["name"]=continent
    
    continent_dict["name"] = continent
    continent_dict["children"] = []
    count=0
    # print(len(continent_set['Nationality'].unique()))
    for country in continent_set['Nationality'].unique():
        
        countries_set = continent_set[continent_set['Nationality']==country][['Name', 'Overall']]
        # print(len(countries_set))
        country_dict = {}
        counter["counter"]=[]
        country_dict["name"] = country
        country_dict["children"] = []
        count=count+len(countries_set.values)
        counter["counter"].append(count)

        for player in countries_set.values:
            
            player_dict = {}
            player_dict['name'] = player[0]
            player_dict['size'] = player[1]
            country_dict["children"].append(player_dict)
        continent_dict['children'].append(country_dict)
    # print(counter)
    # print(count)
    data["children"].append(continent_dict)
    data1["children"].append(counter)
    testdata = dataset.sort_values("Overall", ascending=False).head(20).reset_index()[["Name", "Overall","Continent", "PotentialPoints", "ValueNum", "Age"]]
    data1["dataset"]=testdata
    # print(data1)
players_value = dataset.sort_values("ValueNum", ascending=False).head(20).reset_index()[["Name", "Overall", "PotentialPoints", "ValueNum", "Age"]]
# print(players_value)
players_value1 = dataset.sort_values("Age", ascending=False).reset_index()[["Name", "Overall", "PotentialPoints", "ValueNum", "Age"]]
# print(players_value1)
players_value2 = dataset.sort_values("Overall", ascending=False).reset_index()[["Name", "Overall", "PotentialPoints", "ValueNum", "Age"]]
# print(players_value2)
players_value3 = dataset.sort_values("Age", ascending=False).reset_index()[["Name", "Overall", "PotentialPoints", "ValueNum", "Age","Preferred Positions"]]
sorted_players = dataset.sort_values(["ValueNum"], ascending=False).head(10)
players = sorted_players[["Name" ,"Age" ,"Nationality" ,"Club", "Value"]].values
sorted_players1 = dataset.sort_values(["WageNum"], ascending=False).head(10)
players1 = sorted_players1[["Name" ,"Age" ,"Nationality" ,"Club", "Wage"]].values
value_distribution = dataset.sort_values("WageNum", ascending=False).reset_index().head(100)[["Name", "WageNum"]]
value_distribution_values = value_distribution["WageNum"].apply(lambda x: x/1000)

################ Peels Processing ##################

# To dict conversion to get in the exact format
data_dash = dataset.to_dict('records')

@app.route("/")
def helloworld():
	return render_template('index.html')

@app.route("/plot")
def bigplot():
    return pd.json.dumps(data)

@app.route("/dash")
def dashboard():
    # return pd.json.dumps(data)
    return render_template('main_dash.html')
@app.route("/dash3")
def dashboard3():
    # return pd.json.dumps(data)
    return render_template('map.html')
@app.route("/dash2")
def dashboard_player():    
    return render_template('player_stat.html')
@app.route("/dashboard")
def dashboard_final():    
    return render_template('dashboard.html')
@app.route("/my_render")
def my_rendering():    
    return render_template('my_render.html')
@app.route("/play_dash")
def player_dashing():    
    return render_template('player_dash.html')


@app.route("/value")
def playerchart():
    return pd.json.dumps(players_value)
@app.route("/age")
def ageplayer():
    return pd.json.dumps(players_value1)
@app.route("/overall")
def overallplayer():
    return pd.json.dumps(players_value2)
@app.route("/piechart")
def piechartplayer():
    return pd.json.dumps(data1)

@app.route("/playersvalue")
def playersvalue():
    return pd.json.dumps(players)

@app.route("/playerswage")
def playerswage():
    return pd.json.dumps(players1)

@app.route("/wagedistribution")
def wagedistribution():
    return pd.json.dumps(value_distribution_values)

@app.route("/sample_test")
def sample_test():
    # print(len(dataset))
    return pd.json.dumps(data_dash)

@app.route('/range_include', methods = ['POST'])
def range_include():
    temp = request.get_json()
    print('range received :' ,temp)
    if temp == '1':
        data_3000 = dataset.sort_values("Overall", ascending=False).head(3000).reset_index()
        # print(data_3000)
        return pd.json.dumps(data_3000.to_dict('records'))
    if temp == '2':
        integer_location = np.where(dataset.index == 3000)[0][0]
        start = max(0, integer_location +43)
        end = max(1, 6000)
        dfRange = dataset.iloc[start:end]
        print(start, end, 'values')
        return pd.json.dumps(dfRange.to_dict('records'))
    if temp == '3':
        integer_location = np.where(dataset.index == 6000)[0][0]
        start = max(0, integer_location +100)
        end = max(1, 10000)
        dfRange = dataset.iloc[start:end]
        print(start, end, 'values')
        return pd.json.dumps(dfRange.to_dict('records'))

@app.route("/player_dash", methods = ['POST'])
def player_dashboard():
    # print(len(dataset))
    temp = request.get_json()
    print('input received : ', temp)

    temp = temp.split(",")
    range_sel = temp[0]
    pos = temp[1]

    if range_sel == '1':
        if pos == '0':
            df = dataset_full.sort_values("Overall", ascending=False).head(3000).reset_index()
            return pd.json.dumps(df.to_dict('records'))

        df = dataset_full.sort_values("Overall", ascending=False).head(3000).reset_index()
        data_3000 = df[df['position'] == pos]
        # print(data_3000)
        return pd.json.dumps(data_3000.to_dict('records'))
    if range_sel == '2':
        integer_location = np.where(dataset_full.index == 3000)[0][0]
        start = max(0, integer_location +43+382)
        end = max(1, 6000)
        dfRange = dataset_full.iloc[start:end]
        print(start, end, 'values')

        if pos == '0':
            df = dfRange.sort_values("Overall", ascending=False).head(3000).reset_index()
            return pd.json.dumps(df.to_dict('records'))

        df = dfRange.sort_values("Overall", ascending=False).head(3000).reset_index()
        data_3000 = df[df['position'] == pos]
        # print(data_3000)
        return pd.json.dumps(data_3000.to_dict('records'))

    if range_sel == '3':
        integer_location = np.where(dataset.index == 6000)[0][0]
        start = max(0, integer_location +297)
        end = max(1, 10000)
        dfRange = dataset.iloc[start:end]
        print(start, end, 'values')
        
        if pos == '0':
            df = dfRange.sort_values("Overall", ascending=False).head(3000).reset_index()
            return pd.json.dumps(df.to_dict('records'))

        df = dfRange.sort_values("Overall", ascending=False).head(3000).reset_index()
        data_3000 = df[df['position'] == pos]
        # print(data_3000)
        return pd.json.dumps(data_3000.to_dict('records'))



# print(dataset['total'])
if __name__ == "__main__":
    app.run(debug=True, port=7890)