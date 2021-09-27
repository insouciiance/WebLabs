using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Linq;
using System.Runtime.Serialization;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;

namespace MailWebAPI.Models
{
    public class MailRequest
    {
        public string MailAddress { get; set; }

        public string AuthorName { get; set; }

        [DisplayName("Text")]
        public string Text { get; set; }
    }
}
