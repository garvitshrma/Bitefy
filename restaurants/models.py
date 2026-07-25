from django.db import models
from django.contrib.auth.models import User

# Create your models here.
class Restaurant(models.Model):
    owner = models.OneToOneField(User, on_delete=models.CASCADE)
    name = models.CharField(max_length=100)
    slug = models.SlugField(unique=True, blank=True, null=True)
    is_active = models.BooleanField(default=False)
    account_number = models.CharField(max_length=20, blank=True)
    ifsc_code = models.CharField(max_length=11, blank=True)
    account_holder_name = models.CharField(max_length=100, blank=True)
    is_open = models.BooleanField(default=True)
    gstin = models.CharField(max_length=15, blank=True)
    gst_legal_name = models.CharField(max_length=200, blank=True)
    gst_address = models.TextField(blank=True)
    gst_state = models.CharField(max_length=100, blank=True)
    gst_percent = models.DecimalField(max_digits=5, decimal_places=2, null=True, blank=True)

    def __str__(self):
        return self.name

class MenuItem(models.Model):
    restaurant = models.ForeignKey(Restaurant, on_delete=models.CASCADE)
    name = models.CharField(max_length=100)
    price = models.IntegerField()
    is_available = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.name} - ₹{self.price}"