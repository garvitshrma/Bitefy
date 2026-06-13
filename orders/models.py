from django.db import models
from django.contrib.auth.models import User
from restaurants.models import Restaurant

class Order(models.Model):
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('preparing', 'Preparing'),
        ('ready', 'Ready'),
        ('cancelled', 'cancelled')
    ]

    ORDER_SOURCE_CHOICES = [
        ('online', 'Online'),      
        ('offline', 'Offline'),    
    ]

    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        null=True,
        blank=True
    )
    restaurant = models.ForeignKey(
        Restaurant,
        on_delete=models.CASCADE,
        null=True,
        blank=True
    )
    name = models.CharField(max_length=100)
    items = models.JSONField()
    total = models.IntegerField()
    created_at = models.DateTimeField(auto_now_add=True)
    is_completed = models.BooleanField(default=False)
    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default='pending'
    )
    order_type = models.CharField(max_length=20, choices=ORDER_SOURCE_CHOICES, default='offline') 

    def __str__(self):
        return f"{self.name} - ₹{self.total}"
    

class RemovedOrder(models.Model):
    order = models.OneToOneField(Order, on_delete=models.CASCADE)
    removed_at = models.DateTimeField(auto_now_add=True)
    removed_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True)
    reason = models.CharField(max_length=255, blank=True)

    def __str__(self):
        return f"Removed: {self.order.name}"