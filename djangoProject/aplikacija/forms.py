from django import forms

class loginForm(forms.Form):
    email = forms.EmailInput(attrs={'placeholder': ''})
    password = forms.PasswordInput()
