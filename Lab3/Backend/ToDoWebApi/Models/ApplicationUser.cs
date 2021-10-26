using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Identity;

namespace ToDoWebApi.Models
{
    public class ApplicationUser : IdentityUser
    {
        public ICollection<ToDoNote> Notes { get; set; } = new List<ToDoNote>();
    }
}
