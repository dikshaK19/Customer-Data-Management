﻿using DataTrackr_API.DTO.Account;
using DataTrackr_Web_API.Models;
using System.Collections.Generic;

namespace DataTrackr_API.DTO.Customer
{
    public class GetCustomerDetailsWithAccountsDTO:BaseCustomerDTO
    {
        public virtual Coordinates Headquarters { get; set; }
        public string CountryCode { get; set; }

        public virtual IList<GetAccountDto> Accounts { get; set; }
    }

  
}
