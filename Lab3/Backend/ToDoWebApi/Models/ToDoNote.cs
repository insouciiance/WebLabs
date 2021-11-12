using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Identity;

namespace ToDoWebApi.Models
{
    public class ToDoNote
    {
        [Key]
        public string Id { get; set; }

        [Required]
        [MaxLength(128)]
        public string Name { get; set; }

        [Required]
        public string UserId { get; set; }

        public DateTime DateCreated { get; set; }

        public ApplicationUser User { get; set; }

        public ICollection<ToDoCheckbox> Checkboxes { get; set; } = new List<ToDoCheckbox>();
    }
}
