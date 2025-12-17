using System.ComponentModel.DataAnnotations;

namespace YourProjectNamespace.Models;

public class StockHistory
{
    public int Id { get; set; }

    [Required]
    public int ProductId { get; set; } // Foreign key

    [Required]
    public DateTime ChangeDate { get; set; } = DateTime.UtcNow; // Auto-set

    [Required, StringLength(10)]
    public string ChangeType { get; set; } = "Add"; // "Add" or "Remove"

    [Required, Range(1, int.MaxValue)] // Must be positive
    public int QuantityChanged { get; set; }

    [Required, Range(0, int.MaxValue)] // Stock can't be negative
    public int NewTotal { get; set; }
}