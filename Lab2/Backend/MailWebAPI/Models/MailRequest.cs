using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace MailWebAPI.Models
{
    public class MailRequest
    {
        [EmailAddress(ErrorMessage = "The mail address is not valid.")]
        [Required(ErrorMessage = "Mailing address must be specified.")]
        public string MailAddress { get; set; }

        [Required(ErrorMessage = "Author's name must be specified.")]
        public string AuthorName { get; set; }

        [Required(ErrorMessage = "Email message must be specified.")]
        public string Text { get; set; }
    }
}
