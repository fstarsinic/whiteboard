def asnDataLoad(ips):
    for ip in ips:
        for i in asn_data['services']:
            ip = int(ip)
            for iprange in i[0]:
                x = iprange.split("-")
                try:
         
                    if ip in range(int(x[0]),int(x[1])+1):
                    #if ip >= int(x[0]) and ip < int(x[1])+1:
                        print("now in function for ip  in"+str(ip))
                        data_url = i[1][0]+'autnum/'+str(ip)
                        #print(data_url)
                        headers = {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/101.0.4951.67 Safari/537.36'}
                        #response = requests.get(data_url)  
                        time.sleep(1)
                        req = Request(data_url, headers= headers)           
                        response = urlopen(req)
                        data_json = json.loads(response.read())          
                        #return data_json
                        with open('./raw_asn/'+str(ip)+'.json', 'w') as outfile:
                            json.dump(data_json, outfile)
            
                except:
                    global  k 
                    #print(k)
                    k = k+1
                    print("failed in"+str(ip))
                    if k < 3:
                        print("Retrying again for"+str(ip))
                        #asnDataLoad(ip)
            
                    pass
    
