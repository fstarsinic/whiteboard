import time
import datetime
from datetime import timedelta
import numpy as np
from math import ceil
import calendar
import pandas as pd
import math


def main():
    start_date = datetime.datetime.strptime('2023-01-01', "%Y-%m-%d")
    end_date = datetime.datetime.strptime('2023-12-31', "%Y-%m-%d")

    day_of_week_in_month = 0
    day_of_week_in_year = 0
    day_of_quarter = 0
    week_of_month = 0
    day_of_week = 0

    dimdate_list = []

    dow_mx = np.array([[1,0,0,0],
                [2,0,0,0],
                [3,0,0,0],
                [4,0,0,0],
                [5,0,0,0],
                [6,0,0,0],
                [7,0,0,0]])

    month_count = 0
    quarter_count = 0
    year_count = 0

    current_date = start_date

    def get_week_of_month(dt):
        """ Returns the week of the month for the specified date.
        """
        first_day = dt.replace(day=1)
        dom = dt.day
        adjusted_dom = dom + first_day.weekday()
        return int(ceil(adjusted_dom / 7.0))

    def get_quarter(d):
        return (d.month - 1) // 3 + 1

    def week_in_q(d):
        year = d.year
        soq = {1: datetime.date(year, 1, 1),
               2: datetime.date(year, 4, 1),
               3: datetime.date(year, 7, 1),
               4: datetime.date(year, 10, 1)}
        for i, sow in enumerate(soq[get_quarter(d)] + datetime.timedelta(weeks=x) for x in range(5 * 3)):
            if sow >= d.date():
                return i + 1

    def month_to_quarter (m):
        if m in [1, 2, 3]:
            return 'Q1'
        elif m in [4, 5, 6]:
            return 'Q2'
        elif m in [7, 8, 9]:
            return 'Q3'
        else: return 'Q4'

    def get_month_of_quarter (m):
        d = {1: 1, 2: 2, 3: 3, 4: 1, 5: 2, 6: 3, 7: 1, 8: 2, 9: 3, 10: 1, 11: 2, 12: 3}
        return d[m]

    def gauss_easter(Y):

        # All calculations done
        # on the basis of
        # Gauss Easter Algorithm
        Y = int(Y)
        A = Y % 19
        B = Y % 4
        C = Y % 7

        P = math.floor(Y / 100)
        Q = math.floor((13 + 8 * P) / 25)
        M = (15 - Q + P - P // 4) % 30
        N = (4 + P - P // 4) % 7
        D = (19 * A + M) % 30
        E = (2 * B + 4 * C + 6 * D + N) % 7
        days = (22 + D + E)

        # A corner case,
        # when D is 29
        if (D == 29) and (E == 6):
            return f"{Y}-04-19"
        # Another corner case,
        # when D is 28
        elif (D == 28) and (E == 6):
            return f"{Y}-04-18"
        else:
            # If days > 31, move to April
            # April = 4th Month
            if days > 31:
                dm = days - 31
                return f"{Y}-04-{dm}"
            else:
                # Otherwise, stay on March
                # March = 3rd Month
                return f"{Y}-03-{days}"

    def get_last_friday(current_date):
        return get_last_weekday(current_date, 4)

    def get_last_monday(current_date):
        return get_last_weekday(current_date, 0)

    def get_last_weekday(current_date, weekday):
        year = current_date.year
        month = current_date.month
        day = current_date.day
        last_day = calendar.monthrange(year, month)[1]
        last_weekday = calendar.weekday(year, month, last_day)
        last_friday = last_day - ((7 - (weekday - last_weekday)) % 7)
        result = datetime.date(year, month, day) == datetime.date(year, month, last_friday)
        return result

    current_month = current_date.month
    current_year = current_date.year
    current_quarter = month_to_quarter(current_month)

    MONTH_COUNT = 1
    QUARTER_COUNT = 2
    YEAR_COUNT = 3

    while current_date <= end_date:
        day_of_week_num = int(current_date.strftime("%w"))

        if current_month != current_date.month:
            dow_mx[:, MONTH_COUNT] = 0
            current_month = current_date.month

        if current_quarter != month_to_quarter(current_date.month):
            dow_mx[:, QUARTER_COUNT] = 0
            current_quarter = month_to_quarter(current_date.month)

        if current_year != current_date.year:
            dow_mx[:, YEAR_COUNT] = 0
            current_year = current_date.year

        dow_mx[day_of_week_num][MONTH_COUNT] += 1
        dow_mx[day_of_week_num][QUARTER_COUNT] += 1
        dow_mx[day_of_week_num][YEAR_COUNT] += 1

        day_of_week_in_month = dow_mx[day_of_week_num][MONTH_COUNT]
        day_of_quarter = dow_mx[day_of_week_num][QUARTER_COUNT]
        day_of_week_in_year = dow_mx[day_of_week_num][YEAR_COUNT]

        date = current_date.strftime("%Y-%m-%d")
        date_key = current_date.strftime("%Y%m%d")
        date_id = current_date.strftime("%y%m%d")
        month_id = current_date.strftime("%y%m")
        full_date_usa = current_date.strftime("%m-%d-%Y")
        full_date_uk = current_date.strftime("%d-%m-%Y")
        mmyyyy = current_date.strftime("%m-%Y")
        month_year = current_date.strftime("%B %Y")
        year = current_date.strftime("%Y")
        year_name = f'CY {year}'
        day_of_year = int(current_date.strftime("%j"))
        day_of_month = current_date.day
        weekday_abbr = current_date.strftime("%a")

        first_day_of_month = datetime.date(current_date.year, current_date.month, 1)
        last_day_of_month = calendar.monthrange(current_date.year, current_date.month)[1]
        last_day_of_month_date = datetime.date(current_date.year, current_date.month, last_day_of_month)

        first_day_of_year_date = datetime.date(current_date.year, 1, 1)
        last_day_of_year_date = datetime.date(current_date.year, 12, 31)

        quarter_start_month = ((current_date.month - 1) // 3) * 3 + 1
        first_day_of_quarter_date = datetime.date(current_date.year, quarter_start_month, 1)
        quarter_end_month = ((current_date.month - 1) // 3) * 3 + 3
        last_day_of_quarter_date = datetime.date(current_date.year, quarter_end_month, 1)
        last_day_of_quarter_date = last_day_of_quarter_date.replace(
            day=calendar.monthrange(last_day_of_quarter_date.year, last_day_of_quarter_date.month)[1])

        week_of_month = get_week_of_month(current_date)
        day_name = current_date.strftime("%A")
        week_of_quarter = week_in_q(current_date)
        day_of_month = int(current_date.strftime("%d"))
        is_last_friday = get_last_friday(current_date)
        is_last_monday = get_last_monday(current_date)
        date_format = "%Y-%m-%d"
        easter = gauss_easter(year)
        easterdate = datetime.datetime.strptime(easter, date_format)
        goodfriday = datetime.datetime.strptime(easter, date_format) - \
            datetime.timedelta(days=2)
        eastermonday = datetime.datetime.strptime(easter, date_format) + \
            datetime.timedelta(days=1)
        is_easter = current_date == easterdate
        is_good_friday = current_date == goodfriday
        is_easter_monday = current_date == eastermonday
        month_abbr = current_date.strftime("%b")
        month = current_date.strftime("%B")
        month_num = int(current_date.strftime("%m"))
        month_of_quarter = get_month_of_quarter(month_num)
        quarter = (month_num-1)//3 + 1
        quarter_name = month_to_quarter(month_num)
        week_in_year = int(current_date.strftime("%U"))
        week_in_year_uk = int(current_date.strftime("%W"))
        day_of_week_uk = int(current_date.strftime("%u"))
        is_weekday = day_of_week_num in [1,2,3,4,5]
        day_of_month_suffix = 'th'
        if day_of_month in [1,21,31]:
            day_of_month_suffix = 'st'
        elif day_of_month in [11,12,13]:
            day_of_month_suffix = 'th'
        elif day_of_month in [2,22]:
            day_of_month_suffix = 'nd'
        elif day_of_month in [3,23]:
            day_of_month_suffix = 'rd'

        #create the dict
        date_dict = \
        {'fulldate': date, 'datekey': date_key, 'date_d_id': date_id, 'monthid': month_id, 'year': year,
         'fulldateusa': full_date_usa, 'fulldateuk': full_date_uk, 'dayname': day_name, 'daysuffix': day_of_month_suffix,
         'dayofmonth': day_of_month, 'month': month_num, 'monthname': month, 'weekofyear': week_in_year,
         'weekinyearuk': week_in_year_uk, 'dayofweekuk': day_of_week_uk, 'dayofweekusa': day_of_week,
         'dayofquarter': day_of_quarter, 'weekofquarter': week_of_quarter, 'monthofquarter': month_of_quarter,
         'dayofweekinmonth': day_of_week_in_month, 'dayofweekinyear': day_of_week_in_year,
         'firstdayofmonth': first_day_of_month, 'lastdayofmonth': last_day_of_month_date,
         'firstdayofquarrter': first_day_of_quarter_date, 'lastdayofquarter': last_day_of_quarter_date,
         'firstdayofyear': first_day_of_year_date, 'lastdayofyear': last_day_of_year_date,
         'islastmonday':is_last_monday, 'islastfriday':is_last_friday, 'monthabbr': month_abbr, 'quarter': quarter,
         'quartername': quarter_name, 'dayofyear': day_of_year, 'iseaster': is_easter, 'isgoodfriday': is_good_friday,
         'iseastermonday': is_easter_monday, 'yearname': year_name, 'monthyear': month_year, 'mmyyyy': mmyyyy,
         'isweekday': is_weekday, 'weekofmonth': week_of_month, 'HolidayUSA': '', 'HolidayUK': '', 'HolidayCan': '',
         'isholidayusa': '', 'isholidayuk': '', 'isholidaycan': ''
         }

        dimdate_list.append(date_dict)
        current_date += datetime.timedelta(days=1)

    dimdate_df = pd.DataFrame(dimdate_list)
    dimdate_df['HolidayUSA'] = ''
    dimdate_df['HolidayUK'] = ''
    dimdate_df['HolidayCan'] = ''

    def uk_holidays(x):
        if x['month'] == 5 and x['dayname'] == 'Monday' and day_of_week_in_month == 1:
            return 'Early May Bank Holiday'
        elif x['isgoodfriday']:
            return 'Good Friday'
        elif x['iseastermonday']:
            return 'Easter Monday'
        elif x['month'] == 5 and x['dayname'] == 'Monday' and x['islastmonday'] == 'TRUE':
            return 'Spring Bank Holiday'
        elif x['month'] == 8 and x['dayname'] == 'Monday' and x['islastmonday'] == 'TRUE':
            return 'Summer Bank Holiday'
        elif x['month'] == 12 and x['dayofmonth'] == 26:
            return 'Boxing Day'
        elif x['month'] == 12 and x['dayofmonth'] == 25:
            return 'Christmas'
        elif x['month'] == 1 and x['dayofmonth'] == 1:
            return 'New Year''s Day'
        else:
            return ''

    def us_holidays(x):
        if x['month'] == 1 and x['dayofmonth'] == 1:
            return 'New Year''s Day'
        if x['month'] == 1 and x['dayname'] == 'Monday' and int(x['year']) > 1983 and day_of_week_in_month == 3:
            return 'Martin Luther King Jr Day'
        if x['month'] == 2 and x['dayname'] == 'Monday' and day_of_week_in_month == 3:
            return 'President''s Day'
        elif x['month'] == 5 and x['dayname'] == 'Monday' and x['islastmonday'] == 'TRUE':
            return 'Memorial Day'
        elif x['month'] == 6 and x['dayofmonth'] == 19:
            return 'Juneteenth'
        elif x['month'] == 7 and x['dayofmonth'] == 4:
            return 'Independence Day'
        elif x['month'] == 9 and x['dayname'] == 'Monday' and day_of_week_in_month == 1:
            return 'Labor Day'
        elif x['month'] == 10 and x['dayname'] == 'Monday' and day_of_week_in_month == 2:
            return 'Columbus Day'
        elif x['month'] == 11 and x['dayofmonth'] == 11:
            return 'Veterans Day'
        elif x['month'] == 11 and x['dayname'] == 'Thursday' and day_of_week_in_month == 4:
            return 'Thanksgiving'
        elif x['month'] == 12 and x['dayofmonth'] == 25:
            return 'Christmas'
        else:
            return ''
        # still need memorial day, easter, labor day, election day

    def can_holidays(x):
        if x['month'] == 1 and x['dayofmonth'] == 1:
            return 'New Year''s Day'
        elif x['isgoodfriday']:
            return 'Good Friday'
        elif x['month'] == 7 and x['dayofmonth'] == 1 and x['dayname'] != 'Sunday':
            return 'Canada Day'
        elif x['month'] == 7 and x['dayofmonth'] == 2 and x['dayname'] == 'Monday':
            return 'Canada Day'
        elif x['month'] == 9 and x['dayname'] == 'Monday' and day_of_week_in_month == 1:
            return 'Labour Day'
        elif x['month'] == 9 and x['dayofmonth'] == 30:
            return 'National Day for Truth and Reconciliation'
        elif x['month'] == 12 and x['dayofmonth'] == 25:
            return 'Christmas'
        else:
            return ''
        # still need good friday, Easter Monday, Victoria Day

    dimdate_df["HolidayUK"] = dimdate_df.apply(uk_holidays, axis=1)
    dimdate_df["HolidayUSA"] = dimdate_df.apply(us_holidays, axis=1)
    dimdate_df["HolidayCan"] = dimdate_df.apply(can_holidays, axis=1)
    dimdate_df['isholdayusa'] = dimdate_df.apply(lambda x: True if len(x['HolidayUSA']) else False, axis=1)
    dimdate_df['isholdayuk'] = dimdate_df.apply(lambda x: True if len(x['HolidayUK']) else False, axis=1)
    dimdate_df['isholdaycan'] = dimdate_df.apply(lambda x: True if len(x['HolidayCan']) else False, axis=1)

    return dimdate_df


if __name__ == '__main__':
    df = main()
    print(df.head())
    df.drop(columns=['iseastermonday', 'isgoodfriday', 'iseaster'], inplace=True, errors='ignore')
    df.to_excel('dimdate.xlsx', index=False)