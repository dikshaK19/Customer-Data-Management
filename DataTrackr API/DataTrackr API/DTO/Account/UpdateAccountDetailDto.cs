﻿namespace DataTrackr_API.DTO.Account
{
    public class UpdateAccountDetailDto
    {
        public string Acc_email { get; set; }
        public decimal Acc_revenue { get; set; }

        public string Location { get; set; }

        public string name { get; set; }

        public string EstYear { get; set; }

        public string description { get; set; }
        //public string Customer_email { get; set; }
    }
}
