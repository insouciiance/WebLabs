using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace ToDoWebApi.Models
{
    public class ToDoCheckbox
    {
        [Key]
        public string Id { get; set; }

        [Required]
        [MaxLength(128)]
        public string Text { get; set; }

        [Required]
        public bool Checked { get; set; }

        [Required]
        public DateTime DateCreated { get; set; }

        [Required]
        public string NoteId { get; set; }

        public ToDoNote Note { get; set; }
    }
}
