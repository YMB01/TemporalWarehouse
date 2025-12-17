using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace YourProjectNamespace.Models;

public class Product
{
    public int Id { get; set; }

    [Required, StringLength(100)]
    public string Name { get; set; } = string.Empty;

    [Required, StringLength(50)] // UNIQUE constraint
    public string SKU { get; set; } = string.Empty;

    [Range(0.01, 1000000)]
    public decimal Price { get; set; }

    [Range(0, int.MaxValue)] // Prevent negative stock
    public int CurrentQuantity { get; set; }

    public bool IsDeleted { get; set; } // Soft delete flag

    [Timestamp] // Auto-managed concurrency token
    public byte[]? RowVersion { get; set; } // ? = nullable
}