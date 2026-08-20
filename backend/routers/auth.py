from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from backend.database import get_db
from backend.models import UserModel
from backend.schemas import UserLoginRequest, UserResponse, UserProfileUpdate
from backend.supabase_service import sync_user_to_supabase

router = APIRouter(prefix="/api/auth", tags=["Authentication"])

@router.post("/login", response_model=UserResponse)
def login(req: UserLoginRequest, db: Session = Depends(get_db)):
    user = db.query(UserModel).first()
    if not user:
        user = UserModel(
            email=req.email or "a.vance@supplychain.ai",
            name="Alexander Vance",
            phone="+91 98765 43210",
            role="VP of Global Grocery Logistics"
        )
        db.add(user)
    else:
        if req.email and req.email.strip():
            user.email = req.email.strip()
    db.commit()
    db.refresh(user)
    
    # Background sync to Supabase
    sync_user_to_supabase({
        "email": user.email,
        "name": user.name,
        "phone": getattr(user, "phone", "+91 98765 43210"),
        "role": user.role,
        "avatar": user.avatar
    })

    return UserResponse(
        id=user.id,
        email=user.email,
        name=user.name,
        phone=getattr(user, "phone", "+91 98765 43210") or "+91 98765 43210",
        role=user.role,
        avatar=user.avatar,
        authenticated=True
    )

@router.get("/me", response_model=UserResponse)
def get_current_user(db: Session = Depends(get_db)):
    user = db.query(UserModel).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return UserResponse(
        id=user.id,
        email=user.email,
        name=user.name,
        phone=getattr(user, "phone", "+91 98765 43210") or "+91 98765 43210",
        role=user.role,
        avatar=user.avatar,
        authenticated=True
    )

@router.put("/profile", response_model=UserResponse)
def update_profile(req: UserProfileUpdate, db: Session = Depends(get_db)):
    user = db.query(UserModel).first()
    if not user:
        user = UserModel(
            email=req.email or "a.vance@supplychain.ai",
            name=req.name or "Alexander Vance",
            phone=req.phone or "+91 98765 43210",
            role=req.role or "VP of Global Logistics",
            avatar=req.avatar or "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80"
        )
        db.add(user)
    else:
        if req.name is not None:
            user.name = req.name
        if req.email is not None:
            user.email = req.email
        if req.phone is not None:
            user.phone = req.phone
        if req.role is not None:
            user.role = req.role
        if req.avatar is not None:
            user.avatar = req.avatar
    
    db.commit()
    db.refresh(user)

    # Sync updated profile to Supabase database
    sync_user_to_supabase({
        "email": user.email,
        "name": user.name,
        "phone": user.phone,
        "role": user.role,
        "avatar": user.avatar
    })

    return UserResponse(
        id=user.id,
        email=user.email,
        name=user.name,
        phone=getattr(user, "phone", "+91 98765 43210") or "+91 98765 43210",
        role=user.role,
        avatar=user.avatar,
        authenticated=True
    )
