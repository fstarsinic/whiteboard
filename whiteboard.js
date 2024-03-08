def writeJson(filenames):
    #print(filenames)
    for filename in filenames:
        with open('./raw_asn/'+filename,'r') as f:
            
            try:
                print(filename)
                time.sleep(1)
                data = json.loads(f.read())
                if data != None:
                    d = {}
                    d["AS"] = data["handle"]
                    df_nested_list = pd.json_normalize(data, record_path =["entities"])
                    jsonList = []
                    for js in df_nested_list["vcardArray"]:                     
                        if js:
                            jsonList.append(js)  
                    phone = []
                
                    if "registrant" in df_nested_list["roles"]:
                        print("working")
                                                
                    if df_nested_list["roles"][0][0] == "registrant":
                        for m in jsonList:
                            
                            if type(m[1]) == list and any("org" in sl[3] for sl in m[1]):
                                for l in m[1]:
                                    if "fn" in l:
                                        d["org"] = l[3]
                                    if "tel" in l:
                                        phone.append(l[3])
                                        d["phone"] = phone
                                
                                    if "email" in l:
                                        d["email"] = l[3]
                                        
                                    if "adr" in l:
                                        if l[1]:
                                            d["address"] = l[1]["label"]
                                        else :
                                            d["address"]  = ' '.join((str(n) for n in l[3]))
         

                        if "entities" in df_nested_list:
                            
                            indArray = df_nested_list["entities"]
                            lst = []
                            
                            if not isinstance(indArray[0], list):
                                indArray[0] = []
                            
                            
                            if indArray  is None or  indArray[0] is None : # or not indArray[0]:
                                print("nothing to do")
                                            
                            elif (pd.isnull(indArray[0])).any():
                                print("nothing to do1")
                            
                            else:
                                
                                for j in indArray[0]:
                                    #print(j)
                                    ind = {}
                                    for k in j["vcardArray"][1]:
                                        if "fn" in k:
                                            ind["name"] = k[3]
                                            pass
                                        if "adr" in k:
                                            if k[1]:
                                                ind["address"] = k[1]["label"]
                                            else :
                                                ind["address"]  = ' '.join((str(n) for n in k[3]))
        
                                            pass
                                        if "email" in k:
                                            ind["email"] = k[3]
                                            pass        
                            
                                    
                                    ind["type"] = j["roles"][0]
                                    lst.append(ind)
        
                            d["entities"] = lst
        
                    else :
                        lst = []
                        tele = []
                        i = 0
                        for jData in df_nested_list["vcardArray"]:  
                            ind = {}
                            ind["type"] = df_nested_list["roles"][i]
                            
                            if "registrant" in df_nested_list["roles"][i]:
                                if type(jData) == list and any("org" in sl[3] for sl in jData[1]):
                                    for arr in jData[1]:
                                        #print(d)                                        
                                        if "fn" in arr:
                                            d["org"] = arr[3]                        
                                        if "adr" in arr:
                                            d["address"] = arr[1]["label"]
                                            pass
                                        if "email" in arr:
                                            d["email"] = arr[3]
                                            pass
                                        if "tel" in arr:
                                            tele.append(arr[3])
                                            d["phone"] = tele
                                            pass 
                                
                            i = i+1
                            tele1 = []
                            if type(jData) == list:
                                for arr in jData[1]:
                                    if "fn" in arr:
                                        ind["name"] = arr[3]
                                        pass
                                    if "adr" in arr:
                                        ind["address"] = arr[1]["label"]
                                        pass
                                    if "email" in arr:
                                        ind["email"] = arr[3]
                                        pass
                                    if "tel" in arr:
                                        tele1.append(arr[3])
                                        ind["phone"] = tele1
                                        pass 
                            
                                    
                                lst.append(ind)
                            d["entities"] = lst  
        
                    #return d
                    #print(d)
                    with open('./output_json1/'+str(filename), 'w') as outfile:
                        json.dump(d, outfile)
            except Exception as e:
                print("Error in"+filename)
                print(e)
                faultyFile.append(filename)
                pass
